const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
