const { Router } = require("express");
const { Usuario } = require("../db.js");

const router = Router();

router.post('/', async (req, res) => {
    try{
        const { nombre, apellido, password, email, rol, imagen, telefono, instagram } = req.body 
        
        const usuarioExistente = await Usuario.findOne({
            where: {
                email
            }
        })

        if(!usuarioExistente){
            const nuevoUsuario = await Usuario.create({
                nombre,
                apellido,
                password,
                email,
                rol,
                imagen, 
                telefono,
                instagram
            })

            res.status(200).json(nuevoUsuario)
        }else {
            res.status(400).json({msg: `El usuario con email ${email} ya existe en la base de datos`})
        }
    }catch(error){
        res.status(400).json({error: error.message})
    }
})


module.exports = router;
