const express = require("express");
const Match = require("../models/Match");
const User = require("../models/User");
const router = express.Router();

router.post("/check", async (req, res) => {
  const { uid1, uid2 } = req.body;

  try {
    const user1 = await User.findById(uid1);
    const user2 = await User.findById(uid2);

    if (!user1 || !user2) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    const isMatchForUser1 = user1.matches.includes(uid2);
    const isMatchForUser2 = user2.matches.includes(uid1);

    if (isMatchForUser1 && isMatchForUser2) {
      const existingMatch = await Match.findOne({
        $or: [
          { uid1, uid2 },
          { uid1: uid2, uid2: uid1 },
        ],
      });

      if (existingMatch) {
        return res.status(200).json({
          message: "Match already exists",
          chatid: existingMatch.chatid,
        });
      }

      const chatid = `${uid1}-${uid2}`;
      const newMatch = new Match({
        uid1,
        uid2,
        chatid,
      });

      const savedMatch = await newMatch.save();

      user1.matches.push(savedMatch._id);
      user2.matches.push(savedMatch._id);

      await user1.save();
      await user2.save();

      return res.status(201).json({
        message: "Match created",
        chatid: savedMatch.chatid,
        match: true,
      });
    }

    res.status(200).json({ message: "No mutual match found", match: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get matches for a specific user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all users whose IDs are in the user's matches array
    const matchedUsers = await User.find({ _id: { $in: user.matches } });

    res.status(200).json(matchedUsers); // Return the matched users
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
