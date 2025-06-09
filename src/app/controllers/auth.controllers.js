const { HTTP_STATUS } = require("../constants/status.constant");
const userModel = require("../models/user.model");
const { createJwt } = require("../utils/jwt.util");
const { encryptPassword, comparePassword } = require("../utils/password.util");

//  Middleware function

async function signUp(req, res, next) {
  try {
    const { email, password, firstName, lastName, fullName,} = req.body;

    const isExists = await userModel.exists({ email });
    if (isExists) {
      return res.status(HTTP_STATUS.conflict).json({
        status: HTTP_STATUS.conflict,
        message: "Email exists already",
      });
    }
    
   
    const passwordEncrypted = await encryptPassword(password);
    
    const user = await userModel.create({
      email,
      password: passwordEncrypted,
      firstName,
      lastName,
      fullName
    });


    const token = await createJwt(
      {
        id: user.id,
        email,
      },
      "1d"
    );

    return res.status(200).json({
      status: 200,
      message: "Sign successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

async function login(req, res, next) {
  try {
    const { email, userId} = req.body;

    if (!email || !userId) {
      return res.status(400).json({
        status: 400,
        message: "Email or userId required",
      });
    }

    const loginUser = await userModel.findOne({ email,userId });
    if (!loginUser) {
      return res.status(400).json({
        status: 400,
        message: "Incorrect email & userId",
      });
    }
    
    const token = await createJwt(
      {
        id: loginUser._id,
        email,
      },
      process.env.LOGIN_JWT_EXPIRE_IN
    );

    return res.status(200).json({
      status: 200,
      message: "Login success",
      result: {
        id: loginUser._id,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server Error" });
  }
}

module.exports = {
  signUp,
  login,
};
