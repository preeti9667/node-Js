const AttendanceModel = require("./../models/attendance.model");
const ParticipantModel = require("./../models/participate.model");
const { HTTP_STATUS } = require("../constants/status.constant");
const User = require("../models/user.model");
const { Types, get, mongo } = require("mongoose");
const mongoose = require("mongoose");

async function addAttendance(req, res, next) {
  try {
    const { date, participantIds, meetingId } = req.body;

    if (
      !date ||
      !participantIds ||
      !meetingId ||
      !Array.isArray(participantIds)
    ) {
      return res
        .status(400)
        .json({ message: "Date and participants array are required" });
    }

    const attendanceDate = new Date(date);
    const newAttendance = new AttendanceModel({
      date: attendanceDate,
      participantIds: participantIds,
      meetingId,
    });

    const attendance = await newAttendance.save();
    res
      .status(200)
      .json({ message: "Attendance saved successfully", attendance });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

async function updateUsersAttendanceByDate(req, res, next) {
  try {
    const { date, participantIds, meetingId } = req.body;

    const attendanceId = req.params.id;

    if (!date || !participantIds || !Array.isArray(participantIds)) {
      return res
        .status(400)
        .json({ message: "Date and participants array are required" });
    }

    const attendanceDate = new Date(date);

    const updatedAttendance = await AttendanceModel.findByIdAndUpdate(
      attendanceId,
      { date: attendanceDate, participantIds: participantIds, meetingId },
      { new: true }
    );

    return res.status(200).json({
      message: "Attendance updated successfully",
      attendance: updatedAttendance,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

async function getAllUsers(req, res, next) {
  try {
    const meetingId = req.query.meetingId;
    const date = req.query.date; // date to check attendance

    const match = {
      meetingId: new mongoose.Types.ObjectId(meetingId),
    };

    const pipeline = [
      {
        $match: match,
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $replaceRoot: {
          newRoot: "$user",
        },
      },
    ];

    const users = await ParticipantModel.aggregate(pipeline);
    const attendance = await AttendanceModel.findOne({
      date: new Date(date),
      meetingId
    });

    let list = [];

    if (attendance) {
      const presentUserIds = attendance.participantIds;
      list = users.map((e) => ({
        ...e,
        isPresent: presentUserIds.some(
          (u) => u.toString() === e._id.toString()
        ),
      }));
    } else {
      list = users.map((e) => ({
        ...e,
        isPresent: false,
      }));
    }

    return res.status(200).json({
      status: 200,
      message: "Users list with attendance",
      data: {      
          list,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

async function allAttendanceList(req, res, next) {
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const result = await AttendanceModel.aggregate([
    {
      $facet: {
        count: [
          {
            $count: "count",
          },
        ],
        data: [
          {
            $lookup: {
              from: "meetings",
              localField: "meetingId",
              foreignField: "_id",
              as: "meeting",
            },
          },
          {
            $unwind: {
              path: "$meeting",
              preserveNullAndEmptyArrays: false,
            },
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
          {
            $project: {
              _id: 1,
              meeting: {
                _id: 1,
                title: 1,
                meetingId: 1,
                type: 1,
              },
              date: 1,
              createdAt: 1,
              updatedAt: 1,
              noOfParticipants: {
                $size: "$participantIds",
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        count: {
          $first: "$count.count",
        },
        data: 1,
      },
    },
  ]);

  const count = result[0].count || 0;
  const attendance = result[0].data;

  res.status(200).json({
    status: 200,
    message: "Attendance list",
    data: { count, list: attendance },
  });
}

async function deleteAttendanceDate(req, res, next) {
  try {
    const date = req.params.date;
    const attendance = await AttendanceModel.findOneAndDelete({ date });
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found." });
    }
    return res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}
module.exports = {
  addAttendance,
  allAttendanceList,
  getAllUsers,
  deleteAttendanceDate,
  updateUsersAttendanceByDate,
};
