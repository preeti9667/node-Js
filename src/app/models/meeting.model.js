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
    type: String,
    // enum: ['created','ongoing', 'completed', 'canceled'],
    // default:'created'
  }
});


const meetingModel = mongoose.model("meetingUsers", meetingSchema);
module.exports = meetingModel;
