const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, default: uuidv4, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    description: { type: String },
    skills: { type: [String] },
    interests: { type: [String] },
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
