const { Router } = require("express");
const libros = require("../routes/Libros");
require("../db")
const router = Router();

router.use("libros",libros);



module.exports = router;
