const Message = require("../models/messageModel");

const router = require("express").Router();
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.user });
    res.json(messages);
  } catch (err) {
    res.status(500).send();
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message)
      return res.status(400).json({ err: "This field is required!" });

    const newMessage = new Message({
      message,
      userId: req.user,
    });

    const savedMessage = await newMessage.save();

    res.json(savedMessage);
  } catch (err) {
    res.status(500).send();
  }
});

router.put("/:id/edit", auth, async (req, res) => {
  try {
    const messageId = req.params.id;
    const { message } = req.body;

    if (!message) return res.status(400).json({ err: "" });

    const originalMessage = await Message.findById(messageId);
    if (!originalMessage)
      return res.status(400).json({ err: "This message does not exist!" });

    if (originalMessage.userId.toString() !== req.user)
      return res.status(400).json({ err: "Unauthorized!" });

    originalMessage.message = message;

    const savedMessage = await originalMessage.save();

    res.json(savedMessage);
  } catch (err) {
    res.status(500).send();
  }
});

router.delete("/:id/delete", auth, async (req, res) => {
  try {
    const messageId = req.params.id;

    if (!messageId)
      return res.status(400).json({
        err: "This message does not exists. Please contact the developer.",
      });

    const existingMessage = await Message.findById(messageId);
    if (!existingMessage)
      return res.status(400).json({
        err: "Message with this id does not exists. Please contact the developer.",
      });

    if (req.user !== existingMessage.userId.toString())
      return res.status(401).json({ err: "Unauthorized!" });

    await existingMessage.delete();

    res.json(existingMessage);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;

// try {

// } catch (err) {
//   res.status(500).send();
// }
