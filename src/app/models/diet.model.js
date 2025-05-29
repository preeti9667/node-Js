
const mongoose = require("mongoose");
// const { Schema } = mongoose;

const dietSchema = new mongoose.Schema({
   time: { type: String, required: true },
   text: { type: Object, required: true },
})
  
const dateSchema = new mongoose.Schema({
  date: { type: String, required: true },
  entries: [dietSchema],
});

const userNotesSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  notes: [dateSchema],
}, { timestamps: true });


  
  const DietModel = mongoose.model("diet", userNotesSchema);
  module.exports = DietModel;