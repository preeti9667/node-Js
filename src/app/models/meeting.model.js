const mongoose = require("mongoose");
const { Schema } = mongoose;

const meetingSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  date: {
    type: String,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  status: {
    created: {
      type: String,
    },
    ongoing: {
      type: String,
    },
    completed: {
      type: String,
    },
    cancel: {
      type: String,
    },
  },
});


const meetingModel = mongoose.model("meetingUsers", meetingSchema);
module.exports = meetingModel;
