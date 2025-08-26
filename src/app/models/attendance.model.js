// const { required, object } = require("joi");
// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const userSchema = new Schema({
//  userId: {
//     type: mongoose.Types.ObjectId,
//     required: true
//   },
// });

// const attendanceSchema = new Schema(
//     {
//      date: {
//         type: Date,
//         required: true
//       },
//       userIds:[userSchema]
//     },
//     {
//       timestamps: true,
//     }
//   );

//   const AttendanceModel = mongoose.model("attendance", attendanceSchema);
//   module.exports = AttendanceModel;

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Sub-schema for each user in attendance
const userSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  isAttended: {
    type: Boolean,
    default: false, // default value, can be true if you want
  },
});

// Main attendance schema
const attendanceSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    participantIds: {
      type: [mongoose.Types.ObjectId],
      required: true,
      default: [],
    },
    meetingId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AttendanceModel = mongoose.model("attendance", attendanceSchema);
module.exports = AttendanceModel;
