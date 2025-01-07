const express = require("express");
const router = express.Router();
const db = require("../database/db.js");

router.get("/ranking", async (req, res) => {
    const conn = await db.getConnection();

    try {
        const [result] = await conn.query(`
            SELECT tb1.name, tb2.score from wt_users tb1
            inner join wt_score tb2 on tb1.id = tb2.user_id 
            order by tb2.score desc;
        `);

        res.status(200).json(result);

    } catch (err) {
        console.error(err);
    }

    conn.release();
});

router.post("/finish", async (req, res) => {
    const conn = await db.getConnection();
    const {score, userId} = req.body.params;

    const [scoreData] = await conn.query(`
        SELECT * from wt_score
        where user_id = ?
    `, [userId]);

    const totalScore = scoreData[0].score + score;

    await conn.query(`
        UPDATE wt_score
        set score = ?
        WHERE user_id = ?
    `, [totalScore, userId]);

    res.status(200).json({
        message: "success"
    });

    conn.release();
})

module.exports = router;