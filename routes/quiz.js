const express = require("express");
const router = express.Router();

router.get( "/list", async ( req, res ) => {
    res.status(200).json({
        message: "quiz Success"
    })
});

module.exports = router;