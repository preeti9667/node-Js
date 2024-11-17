const adminModel = require("../models/admin.model");
const { HTTP_STATUS } = require("../constants/status.constant");
const { createJwt } = require("../utils/jwt.util");
const { encryptPassword, comparePassword } = require("../utils/password.util");

async function adminUserCreate() {
  console.log("Checking admin")
  try {
    const data = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: process.env.ADMIN_NAME,
      phone: process.env.ADMIN_PHONE_NUMBER,
    };

    const isExists = await adminModel.exists({ email: data.email });
    if (isExists) {
      console.log("Amin exists already");
      return;
    }
    const passwordEncrypted = await encryptPassword(data.password);
     await adminModel.create({
      ...data,
      password: passwordEncrypted
    });
    console.log("Admin created")
  } catch (error) {
    console.error(error);
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

    const loginUser = await adminModel.findOne({ email });
    if (!loginUser) {
      return res.status(400).json({
        status: 400,
        message: "Incorrect email & password",
      });
    }

    const match = await comparePassword(password, loginUser.password);
    if (!match) {
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
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}
module.exports = {
  login,
  adminUserCreate
};
