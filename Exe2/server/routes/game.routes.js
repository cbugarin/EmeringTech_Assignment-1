const router = require("express").Router();
const gameController = require("../controllers/game.controller");

router.post("/", gameController.createGame);
router.get("/", gameController.getAllGames);
router.get("/:id", gameController.getGameById);
router.put("/:id", gameController.updateGame);
router.delete("/:id", gameController.deleteGame);

module.exports = router;
