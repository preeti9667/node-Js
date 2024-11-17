const mongoose = require("mongoose");
const { adminUserCreate } = require("../app/controllers/admin.controllers");

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/my-app");
    console.log("MongoDB connected");
    adminUserCreate();
  } catch (error) {
    console.error("Error to connect mongodb", error);
  }
}

module.exports = {
  mongodb: main,
};
