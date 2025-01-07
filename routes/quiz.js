const express = require("express");
const router = express.Router();
const db = require("../database/db.js");

router.get("/list", async (req, res) => {
    const conn = await db.getConnection();

    try{
        const [ result ] = await conn.query('SELECT * from wt_users');
        console.log( result );
        res.status(200).json({
            message: "quiz Success"
        });

    }catch( err ){
        console.error(err);
    }

    conn.release();
});

module.exports = router;