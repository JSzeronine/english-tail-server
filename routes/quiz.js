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

router.get( "/my-ranking", async ( req, res) => {
    const conn = await db.getConnection();
    const { userId } = req.query;

    try{
        const [result] = await conn.query(`
            SELECT * FROM (
                SELECT
                tb2.name,
                tb1.user_id,
                tb1.score,
                RANK() OVER (ORDER BY score DESC) AS ranking
                FROM wt_score tb1
                inner join wt_users tb2 on tb1.user_id = tb2.id
            ) ranked_users
            WHERE user_id = ?
        `, [ userId ]);

        res.status(200).json(result[0]);

    }catch( err) {
        console.error( err );
    }

    conn.release();
})

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