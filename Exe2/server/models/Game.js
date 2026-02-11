const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    platform: { type: String, required: true, trim: true },
    releaseYear: { type: Number, required: true },
    developer: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 0, max: 10 },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
