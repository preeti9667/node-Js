const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
