const adminModel = require("../models/admin.model");
const { HTTP_STATUS } = require("../constants/status.constant");
const { createJwt, verifyJwt } = require("../utils/jwt.util");
const { encryptPassword, comparePassword } = require("../utils/password.util");

async function adminUserCreate() {
  console.log("Checking admin");
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
      password: passwordEncrypted,
    });
    console.log("Admin created");
  } catch (error) {
    console.error(error);
  }
}




async function getAdminUser(req, res, next) {
  try {
    const adminId = req.adminId;
    const user = await adminModel.findById(adminId).select([
      '_id', 'name', 'email','phone', 'createdAt'
    ]);

    if (!user) {
      return res.status(HTTP_STATUS.badRequest).json({
        status: HTTP_STATUS.badRequest,
        message: "user not found",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
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

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate JWT token for password reset
    const resetToken = await createJwt(
        {
          id: admin._id,
          email,
        },
        process.env.LOGIN_JWT_EXPIRE_IN
      );
      
      admin.resetPasswordToken = resetToken;
      // admin.resetPasswordExpires = process.env.LOGIN_JWT_EXPIRE_IN;

    await admin.save();

    return res.status(200).json({
      status: 200,
      message: "Password reset link generated",
      result: {
        resetToken, // Fixed: Use resetToken instead of undefined variable
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;

    // Find admin with valid reset token
    const admin = await adminModel.findOne({
      resetPasswordToken: token,
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Encrypt new password
    const passwordEncrypted = await encryptPassword(newPassword);
    admin.password = passwordEncrypted;
    admin.resetPasswordToken = undefined;

    await admin.save();

    return res.status(200).json({
      status: 200,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  login,
  adminUserCreate,
  getAdminUser,
  forgotPassword,
  resetPassword
};
