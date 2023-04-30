const { Router } = require("express");
const { Usuario } = require("../db.js");
const { Op } = require("sequelize");
const { generateToken } = require("../utils/generateToken");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const router = Router();


// envio de email
const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.EMAIL_INKCLOUDJ,
      
      pass: process.env.EMAIL_INKCLOUDJ_PASSWORD,
    },
  });

router.post('/', async (req, res) => {
    try{
        const { nombre, apellido, password, email, rol, imagen, telefono, instagram, fechaNacimiento} = req.body 
        
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
                instagram,
                fechaNacimiento
            })
            const token = jwt.sign({ email }, "secret");

            return res.status(200).send({ message: "Ussuario correctamente registrado", token, nuevoUsuario});
            // res.status(200).json(nuevoUsuario)
        }else {
            res.status(400).json({message: `El usuario con email ${email} ya existe en la base de datos`})
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
                res.status(400).json({message: `El usuario con nombre ${nombre} no se encuentra en la basde de datos`})
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
                res.status(400).json({message: `No se encontro el usuario con email ${email}`})
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
                res.status(400).json({message: `No se encontro el usuario con nombre ${nombre} y email ${email}`})
            }
        }
        if(!nombre && !email){
            const usuario = await Usuario.findAll()

            if(usuario.length > 0){
                res.status(200).json(usuario)
            }else{
                res.status(400).json({message: `No hay usuarios en la base de datos`})
            }
        }
    } catch (error) {
        res.status(400).json({message: error.message})   
    }
})

router.post('/login' , async (req, res) => {
    try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({
        where: { email: email },
      });

      if(!usuario){
        return res.status(401).send({ message: 'Email or Password is invalid'})
      }
      if(!usuario.habilitado){
        return res.status(401).send({message: 'No estas habilitado, contactate con soporte.'})
      }

      if (!usuario.email || !usuario.password)
         return res.status(401).send({ message: "Email o Password invalidos" });
     
     
    if (bcrypt.compareSync(password, usuario.password)) {  
        return res.status(200).json({
            message: "Usuario validado",
            data: {
              ...usuario,
              token: generateToken(usuario),
            },
          });
    }else {
        return res.status(401).send({ message: "Email o Password son invalidos" });
    }
  

    }catch(error){
        return res.status(400).json({error: error.message})
    }

})


// cambio de contraseña gleysmer

router.post("/code", async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await Usuario.findOne({ where: { email } });
  
      if (!user) {
        return res
          .status(404)
          .json({
            message: "No se encontró ningún usuario con ese correo electrónico.",
          });
      }
  
      const confirmationCode = Math.floor(100000 + Math.random() * 900000);
      user.resetPasswordCode = confirmationCode;
      await user.save();
      const mailOptions = {
        from: "INKCLOUDJ@hotmail.com",
        to: user.email,
        subject: "Cambio de contraseña",
        text: `Su código de confirmación es: ${confirmationCode}`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.json({ message: "A confirmation code has been sent to your email." });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Ocurrió un error al procesar su solicitud." });
    }
  });
  
  router.post("/resetPassword", async (req, res) => {
    const { email, code, password } = req.body;
  
    try {
      const user = await Usuario.findOne({ where: { email: email } });
  
      if (!user) {
        return res
          .status(404)
          .json({ message: "Not user found with that email." });
      }
  
      // Verificar que el código proporcionado por el usuario coincide con el código enviado por correo electrónico
      if (code !== user.resetPasswordCode) {
        return res
          .status(400)
          .json({ message: "The confirmation code is invalid." });
      }
  
      user.password = bcrypt.hashSync(password, 8);
      await user.save();
  
      // Generar y enviar token de autenticación al cliente
  
      res.json({ message: "Your password has been successfully changed." });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Ocurrió un error al procesar su solicitud." });
    }
  });


module.exports = router;
