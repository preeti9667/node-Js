const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema(
    {
      name:{
        type: String,
        lowercase: true, 
      },
      email: {
        type: String,
        lowercase: true,
      },
      password: {
        type: String,
      },
      phone: {
        type: String,
      },
     
    },
    {
      timestamps: true,
    }
  );
  
  const adminModel = mongoose.model("adminUsers", adminSchema);
  module.exports = adminModel;
  