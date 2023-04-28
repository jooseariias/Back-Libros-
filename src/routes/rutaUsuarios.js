const { Router } = require("express");
const { Usuario } = require("../db.js");
const { Op } = require("sequelize");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
                nombre: nombre.toUpperCase(),
                apellido: apellido.toUpperCase(),
                password: bcrypt.hashSync(password, 8),
                email,
                rol,
                imagen, 
                telefono,
                instagram
            })
            const token = jwt.sign({ email }, "secret");

            return res.status(200).send({ message: "User registered", token });
            // res.status(200).json(nuevoUsuario)
        }else {
            res.status(400).json({msg: `El usuario con email ${email} ya existe en la base de datos`})
        }
    }catch(error){
        res.status(400).json({error: error.message})
    }
})

router.get('/', async (req, res) => {
    try {
        const {nombre, email} = req.query
        
        if(nombre && !email) {
            const usuario = await Usuario.findAll({
                where: {
                    nombre: {
                        [Op.like]: `%${nombre}%`
                    }
                }
            })
            if(usuario.length > 0){
                res.status(200).json(usuario)
            }else {
                res.status(400).json({msg: `El usuario con nombre ${nombre} no se encuentra en la basde de datos`})
            }
        }
        if(!nombre && email){
            const usuario = await Usuario.findAll({
                where: {
                    email: {
                        [Op.like]: `${email}`
                    }
                }
            })
            if(usuario.length > 0){
                res.status(200).json(usuario)
            }else {
                res.status(400).json({msg: `No se encontro el usuario con email ${email}`})
            }
        }
        if(nombre && email){
            const usuario = await Usuario.findAll({
                where: {
                    email: {
                        [Op.like]: `${email}`
                    },
                    nombre: {
                        [Op.like]: `%${nombre}%`
                    }
                }
            })
            if(usuario.length > 0){
                res.status(200).json(usuario)
            }else {
                res.status(400).json({msg: `No se encontro el usuario con nombre ${nombre} y email ${email}`})
            }
        }
        if(!nombre && !email){
            const usuario = await Usuario.findAll()

            if(usuario.length > 0){
                res.status(200).json(usuario)
            }else{
                res.status(400).json({msg: `No hay usuarios en la base de datos`})
            }
        }
    } catch (error) {
        res.status(400).json({msg: error.message})   
    }
})


module.exports = router;
