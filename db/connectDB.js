const mongoose = require("mongoose");
const connectDB = async () => {
    const users = await mongoose
        .connect(process.env.MOONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 1000,
            ssl: true,
        })
        //serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        //socketTimeoutMS: 300000
        console.log("Connected to MongoDB");
      
};
module.exports = connectDB;
