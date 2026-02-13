const Game = require("../models/Game");

//Create game
exports.createGame = async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//Get all games
exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Get single game
exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json(game);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//Update game
exports.updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json(game);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//Delete game
exports.deleteGame = async (req, res) => {
  try {
    const deleted = await Game.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Game not found" });
    res.json({ message: "Game deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

