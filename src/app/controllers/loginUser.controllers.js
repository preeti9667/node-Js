
const loginUserModel = require('../models/loginUser.model')

function getLoginUser(req, res, next) {
    return res.status(200).json({
      status: 200,
      message: "login user details",
    });
  }

   async function addLoginUser(req, res, next) {
      const body = req.body;
    
    //   console.log(body)
      const user = await loginUserModel.create(body);
    
      return res.status(200).json({
        status: 200,
        message: "login user created",
        data: { user},
      });
    }


  module.exports ={
    getLoginUser,
    addLoginUser
  }