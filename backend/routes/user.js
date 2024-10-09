const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  const { email, password, username, description, skills, interests } =
    req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      description,
      skills,
      interests,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("matches");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate("matches");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a match
router.post("/add-match/:id", async (req, res) => {
  const { uid } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(uid);
    const targetUser = await User.findById(id);

    if (!user || !targetUser) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    const isMatchForUser = user.matches.includes(id);

    if (isMatchForUser) {
      return res.status(200).json({ message: "Match already exists" });
    }

    user.matches.push(id);
    await user.save();

    res.status(201).json({ message: "Match added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
