const meetingModel = require("../models/meeting.model");
const { HTTP_STATUS } = require("../constants/status.constant");


async function createMeeting(req, res, next) {
  try {
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      status: { created, ongoing, completed, cancel },
    } = req.body;

    // const isExists = await meetingModel.exists({ title});
    // if (isExists) {
    //   console.log("title exists already");
    //   return;
    // }


    const meeting = await meetingModel.create({
      title,
      description,
      date,
      startTime,
      endTime,
      status: {
        created,
        ongoing,
        completed,
        cancel,
      },
    });

    return res.status(200).json({meeting}) 

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

// async function getMeetingList(req, res, next) {
//     try {
//       const meetingList = await meetingModel.find(req.body)

//       if(!meetingList){
//         return res.status(HTTP_STATUS.badRequest).json({
//           status: HTTP_STATUS.badRequest,
//           message: "meeting not found",
//         });
//       }
//       return res.status(200).json({meetingList}) 

//     } catch (error) {
//       console.error(error);
//     res.status(500).json({ error: "Internal server Error" });
      
//     }

// }
// async function getMeeting(req, res, next) {
//   try {
//     const meetingId = req.params.id
//     const meeting = await meetingModel.findById(meetingId)
    
//     if(!meeting){
//       return res.status(HTTP_STATUS.badRequest).json({
//         status: HTTP_STATUS.badRequest,
//         message: "meeting not found",
//       });
//     }

//     return res.status(200).json({meeting}) 

//   } catch (error) {
//     console.error(error);
//   res.status(500).json({ error: "Internal server Error" });
    
//   }

// }

module.exports = {
  getMeetingList,
  createMeeting,
  getMeeting
};
