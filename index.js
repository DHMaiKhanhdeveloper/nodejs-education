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

dotenv.config(); // doc file .env

// mongoose
//     .connect("mongodb://0.0.0.0:27017/educationapp")
//     .then(() => console.log("✅ Connected database from mongodb."))
//     .catch((error) =>
//         console.error(
//             `❌ Connect database is failed with error which is ${error}`
//         )
//     );

// mongoose.connect(
//     process.env.MOONGO_DB,
//     { useNewUrlParser: true, useUnifiedTopology: true,   connectTimeoutMS: 100},
//     () => {
//       console.log('Connected to MongoDB');
//     }
//   );

  mongoose.connect(
    process.env.MOONGO_DB,
    { useNewUrlParser: true, useUnifiedTopology: true,   connectTimeoutMS: 100})
    .then((result)=>  console.log('Connected to MongoDB'))
    .catch((error)=>  console.log(error));

const userRoute = require("./routes/userRouter");
const { error } = require("console");
app.use("/users", userRoute);

// mongoose.connect((process.env.MOONGO_DB), ()=>{
//     console.log("mongoose is connected");
// });
// setTimeout(function() {
//     mongoose.connect((process.env.MOONGO_DB), ()=>{
//             console.log("mongoose is connected");
//         });
//   }, 1000);

// async function run() {
//     await mongoose.connect(process.env.MOONGO_DB);
//     console.log("mongoose is connected");
// }
// mongoose.connect(
//     process.env.MOONGO_DB,
//     { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true ,  connectTimeoutMS: 100},
//     () => {
//       console.log('Connected to MongoDB');
//     }
//   );

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

// const PORT = app.get("PORT") || 4000;
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running ....${PORT}`);
});
