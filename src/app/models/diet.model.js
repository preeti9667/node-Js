const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  time: { type: String, required: true },
  text: { type: Object, required: true },
});

const userDateNotesSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  entries: [entrySchema],
}, { timestamps: true });


const DietModel = mongoose.model("Diet", userDateNotesSchema);
module.exports = DietModel;

