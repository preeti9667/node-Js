
const mongoose = require("mongoose");
const { Schema } = mongoose;

const participateSchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      date:{
        type: Date,
        required: true
      },
      time:{
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
  
  const ParticipantModel = mongoose.model("participants", participateSchema);
  module.exports = ParticipantModel;
  