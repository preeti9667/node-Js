const { HTTP_STATUS } = require("../constants/status.constant");
// const adminModel = require("../models/admin.model");
const userModel = require("../models/user.model");
const { createJwt } = require("../utils/jwt.util");

async function createUsers(req, res, next) {
  const {firstName, lastName, fullName, email,userId} = req.body;

 
  try {
    const isExists = await userModel.exists({ email});

    if (isExists) {
      return res.status(HTTP_STATUS.conflict).json({
        status: HTTP_STATUS.conflict,
        message: "Email exists already",
      });
    }

    const generateUserId = (len=6) => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let userId = "";
      for (let i = 0; i < len; i++) {
        userId += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return userId;
    };
      const userid = generateUserId()
      // console.log(userid)

    const user = await userModel.create({
    userId: userid,
      firstName,
      lastName,
      fullName,
      email
    });

    const token = await createJwt(
      {
        userId: userid,
        email,
      },
      "1d"
    );
    return res.status(200).json({
      status: 200,
      message: "user successful",
      data: {
        user: {
          userId: userid,
          email,
        },
        token,
      },
    });

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}



async function getUser(req, res, next) {
  try {
    const user_Id = req.params.id;
    const user = await userModel.findById({_id: user_Id});
    if (!user) {
      return res.status(HTTP_STATUS.badRequest).json({
        status: HTTP_STATUS.badRequest,
        message: "user not found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "user details",
      data: {
        id: user._id,
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

async function getUsers(req, res, next) {
    // const users = await userModel.find()
  try {
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;
    const match = {};
    const status = req.query.status;
    const search = req.query.search;
   
     // Sorting for fullName and userId separately
     const fullNameSort = req.query.fullNameSort === "desc" ? -1 : 1;
     const userIdSort = req.query.userIdSort === "desc" ? -1 : 1;
    
    

    if (status) {
      match.status = status;
    }
    if (search) {
      match.firstName = { $regex: search, $options: "i" };
    }

   

    const count = await userModel.countDocuments(match);

    const list = await userModel.find(match).skip(skip).limit(limit).sort({ fullName: fullNameSort, userId: userIdSort });
    
    
    return res.status(200).json({
      status: 200,
      message: "users list",
      data:{
        page,
        limit,
        count,
        list,
        
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server Error" });
  }  

}

module.exports = {
  getUser,
 getUsers,
 createUsers
};
