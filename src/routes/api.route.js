const router = require("express").Router();
const UserController = require("../controllers/user.controller");
const ImageController = require("../controllers/image.controller");

router.get("/", UserController.helloWorld);
router.post("/gerar-imagem", ImageController.gerarImagem);

module.exports = router;
