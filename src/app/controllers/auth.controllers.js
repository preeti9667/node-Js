const { HTTP_STATUS } = require("../constants/status.constant");
const loginUserModel = require("../models/loginUser.model");
const userModel = require("../models/user.model");
const { createJwt } = require("../utils/jwt.util");
const { encryptPassword } = require("../utils/password.util");

//  Middleware function

async function signUp(req, res, next) {
  try {
    const { email, password } = req.body;

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
      password:passwordEncrypted,
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
    console.error(error)
    res.status(500).json({ error: "Internal server Error" });
  }
}

async function getLoginUsers(req, res, next) {
  try {
    const data = await loginUserModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server Error" });
  }
}

async function upDateLoginUser(req, res, next) {
  const contact = await loginUserModel.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("not found UpData");
  }
  const upDateData = await loginUserModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(upDateData);
}

async function deleteLoginUser(req, res, next) {
  try {
    const personId = req.params.id;
    const response = await loginUserModel.findByIdAndDelete(personId);

    if (!response) {
      return res.status(400).json({ Error: "error" });
    }
    res.status(200).json({ message: "delete" });
  } catch (error) {
    res.status(500).json({ error: "Internal server Error" });
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        message: "Email or password required",
      });
    }

    const loginUser = await loginUserModel.findOne({ email });
    if (!loginUser) {
      return res.status(400).json({
        status: 400,
        message: "Incorrect email & password",
      });
    }

    if (loginUser.password !== password) {
      return res.status(400).json({
        status: 400,
        message: "Incorrect email & password",
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
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server Error" });
  }
}

module.exports = {
  signUp,
  getLoginUsers,
  deleteLoginUser,
  upDateLoginUser,
  login,
};
