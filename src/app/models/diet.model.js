
const mongoose = require("mongoose");
const { Schema } = mongoose;

const dietSchema = new Schema(
    {
      userId: {
        type: mongoose.Types.ObjectId
      },
      meetingId: {
        type: mongoose.Types.ObjectId,
      },

    },
    {
      timestamps: true,
    }
  );
  
  const DietModel = mongoose.model("diet", dietSchema);
  module.exports = DietModel;