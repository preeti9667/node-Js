const mongoose = require("mongoose");
const { Schema } = mongoose;
const { MEETING_STATUS, MEETING_TYPE} = require("../constants/meeting.constant");

const meetingSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(MEETING_STATUS),
      default:MEETING_STATUS.CREATED
    },
    type: {
      type: String,
      enum: Object.values(MEETING_TYPE),
    },
    noOfParticipant: {
      type: Number
    }
  },
  {
    timestamps: true,
  }
);

const meetingModel = mongoose.model("meetings", meetingSchema);
module.exports = meetingModel;
