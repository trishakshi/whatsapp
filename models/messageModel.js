const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const messageSchema = new mongoose.Schema(
  {
    message: { type: String },
    userId: { type: ObjectId },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("message", messageSchema);

module.exports = Message;
