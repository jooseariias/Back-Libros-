const { Router } = require("express");

const router = Router();


const librosRuta = require("./rutaLibros");
const usuariosRuta = require('./rutaUsuarios')
// require("../db")

router.use('/libros', librosRuta);
router.use('/usuarios', usuariosRuta)



module.exports = router;
