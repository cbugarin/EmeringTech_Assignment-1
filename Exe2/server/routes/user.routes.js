const router = require("express").Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

// all these require login (cookie JWT)
router.get("/me/games", authMiddleware, userController.getMyGames);
router.post("/me/games/:gameId", authMiddleware, userController.addGameToMyLibrary);
router.delete("/me/games/:gameId", authMiddleware, userController.removeGameFromMyLibrary);

module.exports = router;
