const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
var http = require("http");
const Joi = require("joi");
const app = express();

app.use(morgan("dev")); 
app.use(bodyParser.json());
app.use(helmet());

dotenv.config();

mongoose
    .connect("mongodb://0.0.0.0:27017/educationapp")
    .then(() => console.log("✅ Connected database from mongodb."))
    .catch((error) =>
        console.error(
            `❌ Connect database is failed with error which is ${error}`
        )
    );
const userRoute = require("./routes/userRouter");
app.use("/users", userRoute);

app.use((req, res, next) => {
        const err = new Error("Not Found"); // tạo ra lỗi
        err.status = 404;
        next(err); // chuyển lỗi
    });
    
    
app.use((err, req, res, next) => {
        const error = app.get("env") === "development" ? err : {};
        const status = err.status || 500; // lỗi không xác định
    
        // response to client
        return res.status(status).json({
            error: {
                message: error.message,
            },
        });
    });
    
    
const port = app.get("port") || 4000;
    app.listen(port, () => {
        console.log(`Server is running ....${port}`);
    });