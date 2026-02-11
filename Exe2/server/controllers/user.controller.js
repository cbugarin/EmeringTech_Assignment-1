const User = require("../models/User");
const Game = require("../models/Game");


exports.getMyGames = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("games");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user.games);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


exports.addGameToMyLibrary = async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // prevent duplicates
    const alreadyAdded = user.games.some((id) => id.toString() === gameId);
    if (alreadyAdded) return res.status(400).json({ message: "Game already in your library" });

    user.games.push(gameId);
    await user.save();

    return res.json({ message: "Game added to your library" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


exports.removeGameFromMyLibrary = async (req, res) => {
  try {
    const { gameId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.games = user.games.filter((id) => id.toString() !== gameId);
    await user.save();

    return res.json({ message: "Game removed from your library" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
