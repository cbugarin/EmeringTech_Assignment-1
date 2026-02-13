const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["user", "admin"], 
      default: "user" 
    },
    games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);