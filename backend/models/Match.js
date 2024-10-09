const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    uid1: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    uid2: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    chatid: { type: String, required: true },
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);
module.exports = Match;
