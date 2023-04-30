const { Router } = require("express");
const { Libro, Usuario, Subida, Genero } = require("../db.js");
const { conn } = require("../db.js");
const { Op } = require("sequelize");

const router = Router();

router.post("/", async (req, res) => {
  const transaction = await conn.transaction();
  try {
    const {
      isbn,
      titulo,
      sinopsis,
      fecha,
      cantidadDePaginas,
      imagenDeTapa,
      linkDescarga,
      autores,
      generos,
      idUsuario,
    } = req.body;

    // console.log("autores es: ", autores);
    if (
      !isbn ||
      !titulo ||
      !sinopsis ||
      !fecha ||
      !cantidadDePaginas ||
      !imagenDeTapa ||
      !linkDescarga ||
      !autores || 
      !generos || 
      !idUsuario
    ) {
      res.status(400).json({ msg: "Datos faltantes para crear un libro" });
    } else {
      // const {autores } = req.body;

      // console.log("autores es: ", autores)
      const libroEncontrado = await Libro.findOne({
        where: {
          isbn,
        },
      });

      if (!libroEncontrado) {
        const nuevoLibro = await Libro.create({
          isbn,
          titulo,
          sinopsis,
          fecha,
          cantidadDePaginas,
          imagenDeTapa,
          activo: true,
          linkDescarga,
        });

        const usuarioCreador = await Usuario.findOne({
          where: {
            id: idUsuario,
          },
        });
        const nuevaSubida = await Subida.create({
          // fecha: Date.now(),
          libroIsbn: isbn,
          usuarioId: usuarioCreador.id,
        });

        // await nuevoLibro.setSubida(nuevaSubida);
        // await nuevoLibro.setUsuario()

        for(let i = 0; i < autores.length; i++) {
          // console.log(autores[i])
          const nuevoAutor = await Usuario.findOne({
            where: {
              id: autores[i].id,
            },
          });

          // console.log("nuevoAutor es: ", nuevoAutor); // Verificar si hay algún resultado

          // await nuevoAutor.addLibro
          // await nuevoLibro.setUsuario(nuevoAutor)
          await nuevoLibro.addUsuario(nuevoAutor);
        }
        for(let i = 0; i < generos.length; i++){
          const genero = await Genero.findOne({
            where: {
              id: generos[i].id
            }
          })
          await nuevoLibro.addGenero(genero)
        }
        await transaction.commit();
        res.status(200).json(nuevoLibro);
      } else {
        res
          .status(400)
          .json({ msg: "El libro ya esta dado de alta con ese ISBN" });
      }
    }
  } catch (error) {
    await transaction.rollback();
    // console.log("entra aca")
    // console.log("error es: ", error)
    res.status(400).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const { nombreLibro } = req.query;

    if(nombreLibro){
     

      const libro = await Libro.findAll({
        where: {
          titulo: {
            [Op.iLike]: `%${nombreLibro}%`
          }
        }
      })
      
      console.log(libro)
      libro.length > 0 ? res.status(200).json(libro) 
        : res.status(400).json({message: `Libro no encontrado`})
    }else {
      const libro = await Libro.findAll()
      
      libro.length > 0 ? res.status(200).json(libro) 
        : res.status(400).json({message: `No hay libros en la base de datos`})
    }

  }catch(error){
    res.status(400).json({error: error.message})
  }
})



// router.get("/libros/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const pdf = await Libros.findByPk(id);

//     if (!pdf) {
//       return res.status(404).json({ error: "no libro" });
//     }

//     res.status(200).json(pdf);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "no libro" });
//   }
// });

// router.put("/libros/:id", async (req, res) => {
//   try {
//     const libroUpdate = await Libros.findOne({
//       where: {
//         id: req.params.id,
//       },
//     });

//     if (libroUpdate) {
//       let data = { ...req.body };

//       let keys = Object.keys(data);

//       keys.forEach((k) => {
//         libroUpdate[k] = data[k];
//       });

//       await libroUpdate.save();

//       res.status(200).send(libroUpdate);
//     } else {
//       res.status(404);
//     }
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

module.exports = router;
