const { HTTP_STATUS } = require("../constants/status.constant");
const adminModel = require("../models/admin.model");
const userModel = require("../models/user.model");
const { verifyJwt } = require("../utils/jwt.util");

async function getUser(req, res, next) {
  try {
    const userId = req.params.id;
    const user = await userModel.findById({_id: userId});
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

    if (status) {
      match.status = status;
    }
    if (search) {
      match.firstName = { $regex: search, $options: "i" };
    }

    const count = await userModel.countDocuments(match);

    const list = await userModel.find(match).skip(skip).limit(limit);
    
    
    return res.status(200).json({
      status: 200,
      message: "users list",
      data:{
        page,
        limit,
        count,
        list
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server Error" });
  }  

}

module.exports = {
  getUser,
 getUsers,
};
