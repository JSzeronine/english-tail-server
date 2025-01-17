require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger.json'); // swagger-autogen이 생성한 파일


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
app.use('/swagger-api', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const quiz = require("./routes/quiz");
const user = require("./routes/user");
const {query} = require("express");


app.use("/quiz", quiz);
app.use("/user", user);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Success"
    })
});

app.listen(process.env.PORT, () => {
    console.log("Server Connect Success");
});