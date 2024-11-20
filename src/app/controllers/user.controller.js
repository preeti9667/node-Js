const { HTTP_STATUS } = require("../constants/status.constant");
const adminModel = require("../models/admin.model");
const userModel = require("../models/user.model");
const { verifyJwt } = require("../utils/jwt.util");

async function getUser(req, res, next) {
  try {


    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(HTTP_STATUS.unAuthorize).json({
        status: HTTP_STATUS.unAuthorize,
        message: "Unauthorized",
      });
    }
    const [method, token] = authorization.split(" ");

    if (method !== "Bearer" || !token) {
      return res.status(HTTP_STATUS.unAuthorize).json({
        status: HTTP_STATUS.unAuthorize,
        message: "Unauthorized",
      });
    }

    const decodedToken = await verifyJwt(token);
    const adminId = decodedToken.id;
    const admin = await adminModel.findById(adminId);

    if (!admin) {
      return res.status(HTTP_STATUS.unAuthorize).json({
        status: HTTP_STATUS.unAuthorize,
        message: "user not found",
      });
    }

    const userId = req.params.id;

    const user = await userModel.findById(userId);
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
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

// function upDateUser(req, res, next) {
//     return res.status(200).json({
//       status: 200,
//       message: "user upDate",
//     });
//   }

function deleteUser(req, res, next) {
  return res.status(200).json({
    status: 200,
    message: "user delete",
  });
}

// async function addUser(req, res, next) {
//   const body = req.body;

//   console.log(body)
//   const user = await userModel.create(body);

//   return res.status(200).json({
//     status: 200,
//     message: "user created",
//     data: { user},
//   });
// }

async function addUser(req, res, next) {
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    res.status(400);
    throw new Error("all filed are mandatory");
  }
  const contact = await userModel.create({
    firstName,
    lastName,
  });
  res.status(201).json({ contact });
}

async function upDateUser(req, res, next) {
  const contact = await userModel.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("not found UpData");
  }
  const upDateData = await userModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(upDateData);
}

async function deleteUser(req, res, next) {
  const contact = await userModel.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("not found delete");
  }

  await userModel.remove();

  res.status(200).json(contact);
}

module.exports = {
  getUser,
  addUser,
  upDateUser,
  deleteUser,
};
