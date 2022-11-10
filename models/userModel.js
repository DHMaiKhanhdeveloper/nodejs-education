const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
    },
    job: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        minLength: 6,
        maxLength:15
    },
    GoogleID: {
        type: String,
        default: null,
    },
    FacebookID: {
        type: String,
        default: null,
    },
    authType: {
        type: String,
        enum: ['local','google','facebook'],
        default: 'local',
    },
});

// mã hoá mật khẩu trước khi lưu , hàm băm mật khẩu
UserSchema.pre("save", async function (next) {
    try {
        if(this.authType !== 'local') next()
        // console.log("this.password " + this.password);
        var salt = await bcrypt.genSalt(10);
        console.log("salt" + salt);
        var passwordHased = await bcrypt.hash(this.password, salt);
        console.log("password_Hased" + passwordHased);
        this.password = passwordHased;
        next(); // next controller
    } catch (err) {
        next(err);
    }
});
UserSchema.methods.isValidPasword = async function (newpassword) { // phải có return
    try {
        return await bcrypt.compare(newpassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};
const UsersModel = mongoose.model("User", UserSchema);
module.exports = UsersModel;
