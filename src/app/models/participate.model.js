
const mongoose = require("mongoose");
const { Schema } = mongoose;

const participateSchema = new Schema(
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
  
  const ParticipantModel = mongoose.model("participants", participateSchema);
  module.exports = ParticipantModel;
  