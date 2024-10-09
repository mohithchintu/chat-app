const express = require("express");
const Chat = require("../models/Chat");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { chatid, sender, message } = req.body;

  try {
    let chat = await Chat.findOne({ chatid });

    if (!chat) {
      chat = new Chat({ chatid, chats: [{ sender, message }] });
    } else {
      chat.chats.push({ sender, message });
    }

    const savedChat = await chat.save();
    res.status(201).json(savedChat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:chatid", async (req, res) => {
  const { chatid } = req.params;

  try {
    const chat = await Chat.findOne({ chatid }).populate(
      "chats.sender",
      "username email"
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
