const mongoose = require("mongoose");
const { adminUserCreate } = require("../app/controllers/admin.controllers");

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    adminUserCreate();
  } catch (error) {
    console.error("Error to connect mongodb", error);
  }
}

module.exports = {
  mongodb: main,
};
