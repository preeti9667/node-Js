const mongoose = require("mongoose");
const { Schema } = mongoose;

const loginUserSchema = new Schema({
    email:{
    type: String,

    },
    password:{
        type: Number
    }
})
const loginUserModel = mongoose.model("loginUser", loginUserSchema);
module.exports = loginUserModel;
