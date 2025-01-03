require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use(cors({
    origin: process.env.CORS_HOST,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
}));

app.options("*", cors());

const quiz = require("./routes/quiz");

app.use("/quiz", quiz);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Success"
    })
});

app.listen(process.env.PORT, () => {
    console.log("Server Connect Success");
});