const express = require("express");
const router = express.Router();

const IndexController = require("../controllers/index.controller");
const ImageController = require("../controllers/image.controller");
const { validate } = require("../middlewares/validators/wrapper.validator");
const {
  indexValidator,
} = require("../middlewares/validators/index.validations");

router.get("/", IndexController.index);
router.post("/", validate(indexValidator), IndexController.indexPost);

router.get("/gerar-imagem", ImageController.gerarImagem);

module.exports = router;
