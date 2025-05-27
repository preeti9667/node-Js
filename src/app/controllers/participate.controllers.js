const ParticipantModel = require("../models/participate.model");
const { HTTP_STATUS } = require("../constants/status.constant");
const User = require("../models/user.model");
const Meeting = require("../models/meeting.model");
const { Types } = require("mongoose");
async function addParticipate(req, res, next) {
  const { userIds,removedUserIds, meetingId } = req.body;
  try {

    for(const userId of userIds){
        const isExists = await ParticipantModel.exists({ meetingId, userId });
        if(!isExists){
            await ParticipantModel.create({
                userId,
                meetingId,
            });
        }
    }

    await ParticipantModel.deleteMany({ meetingId, userId: { $in: removedUserIds } });

    return res.status(HTTP_STATUS.success).json({
        status: HTTP_STATUS.success,
      message: "Participate updated successfully",
      data: {
        
      },
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

async function participantList(req, res, next) {
  try {
    const meetingId = req.params.id;
    const participants = await ParticipantModel.aggregate(
      [
        {
          '$match': {
            'meetingId': new Types.ObjectId(meetingId)
          }
        }, 
        {
          '$lookup': {
            'from': 'users', 
            'localField': 'userId', 
            'foreignField': '_id', 
            'as': 'users'
          }
        }, 
        {
          '$project': {
            '_id': 1, 
            'createdAt': 1, 
            'user': {
              '$first': '$users'
            }
          }
        }
      ]
    );
    return res.status(HTTP_STATUS.success).json({
      status: HTTP_STATUS.success,
      message: "Participant list",
      data: {
        list:participants,
      },
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

async function searchUserForParticipant(req, res, next) {
  try {

    const meetingId = req.params.id;
    const search = req.query.search || '';
    const limit = Number(req.query.limit) || 10;
    const nextPageTimeStamp = req.query.nextPageTimeStamp;
    const match = {
      createdAt: { $lte: new Date(nextPageTimeStamp) },
      '$or': [
        {
          'fullName': {
            '$regex': `${search}`, 
            '$options': 'i'
          }
        }, {
          'userId': {
            '$regex': `${search}`, 
            '$options': 'i'
          }
        }, {
          'email': {
            '$regex': `${search}`, 
            '$options': 'i'
          }
        }
      ]
    }
    if(!nextPageTimeStamp) delete match.createdAt;
    if(!search) delete match.$or;
    const pipeline = [
      {
        '$match': match
      }, 
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        '$limit': limit+1
      }, 
      {
        '$lookup': {
          'from': 'participants', 
          'let': {
            'uid': '$_id'
          }, 
          'as': 'result', 
          'pipeline': [
            {
              '$match': {
                'meetingId': new Types.ObjectId(meetingId), 
                '$expr': {
                  '$eq': [
                    '$$uid', '$userId'
                  ]
                }
              }
            }
          ]
        }
      }, {
        '$project': {
          '_id': 1, 
          'userId': 1, 
          'fullName': 1, 
          'email': 1, 
          'createdAt': 1,
          'isParticipant': {
            '$gt': [
              {
                '$size': '$result'
              }, 0
            ]
          }
        }
      }
    ];

    const users = await User.aggregate(pipeline);

    let nextPage = null;
    const list = [];
    users.forEach((user, index) => {
      if(index < limit){
        list.push(user);
      }else{
        nextPage = user.createdAt;
      }
    })

    // console.log(nextPage);
    return res.status(HTTP_STATUS.success).json({
      status: HTTP_STATUS.success,
      message: "Users list",
      data: {
        nextPage,
        list,
      },
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

module.exports = {
  addParticipate,
  participantList,
  searchUserForParticipant
};
