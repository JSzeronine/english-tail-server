const db = require("../database/db");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {decode} = require("jsonwebtoken");

let cookieSecure;
if (process.env.NODE_ENV === "development") {
    cbLink = "http://localhost:3000/login";
    redirectUrl = "http://localhost:3090";
    cookieSecure = false;
} else {
    cbLink = "https://english-tail.com/login";
    redirectUrl = "https://api.teammaxdive.com";
    cookieSecure = true;
}

router.post("/signup", async (req, res) => {
    const conn = await db.getConnection();
    const {
        email,
        password,
        username
    } = req.body.userData;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [user] = await conn.query(`
            SELECT * from wt_users
            where email = ? or name = ?
        `, [email, username]);

        if (user && user.length > 0) {
            res.status(401).json({
                message: "이메일 및 아이디가 존재 합니다."
            });

            return;
        }

        const [result] = await conn.query(`
            INSERT INTO wt_users ( password, email, name ) values (?,?,?)
        `, [hashedPassword, email, username]);

        await conn.query(`
            INSERT INTO wt_score (user_id, score) value ( ?, 1000 )
        `, [result.insertId]);

        res.status(200).json(result);

    } catch (err) {
        console.error(err);
    }

    conn.release();
});

router.get("/login", async (req, res) => {
    const conn = await db.getConnection();
    const {email, password} = req.query;

    try {
        const [result] = await conn.query(`
            SELECT id, email, name, password from wt_users
            where email = ?
        `, [email]);

        const isPassword = await bcrypt.compare(password, result[0].password);

        if (isPassword) {
            const token = jwt.sign({
                id: result[0].id,
                email: result[0].email,
                username: result[0].name
            }, process.env.JWT_SECRET, {
                expiresIn: '30d'
            });

            res.cookie("auth_token", token, {httpOnly: true, secure: cookieSecure});
            res.status(200).json({
                message: "Success"
            });
        } else {
            res.status(401).json({
                message: "아이디, 비밀번호가 맞지 않습니다."
            });
        }
    } catch (err) {
        res.status(401).json({
            message: "아이디, 비밀번호가 맞지 않습니다."
        });
    }

    conn.release();
});

router.get("/info", async (req, res) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).send("Unauthorized");

    try {
        const user = await jwt.verify(token, process.env.JWT_SECRET);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({message: 'Invalid token'});
    }
});

router.get("/loginout", async (req, res) => {

});


module.exports = router;