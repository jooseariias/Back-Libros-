const { Router } = require("express");
const { Libro, Usuario, Subida, Genero, libro_autor } = require("../db.js");
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

        console.log("autores: ", autores)
        for(let i = 0; i < autores.length; i++) {
          console.log("autores[i] es ", autores[i])
          const nuevoAutor = await Usuario.findOne({
            where: {
              id: autores[i].id,
            },
          });

          console.log("nuevoAutor es: ", nuevoAutor); // Verificar si hay algún resultado

          // await nuevoAutor.addLibro
          // await nuevoLibro.setUsuario(nuevoAutor)
          // await nuevoLibro.addUsuario(nuevoAutor);
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
    res.status(400).json({error: error.message});
  }
});

router.get('/', async (req, res) => {
  try {

    const { nombreAutor, nombreLibro } = req.query;

    if(nombreAutor && nombreLibro){
      const autores = await Usuario.findAll({
        where: {
          nombre: {
            [Op.iLike]: `%${nombreAutor}%`
          }
        }
      });

      if (autores.length === 0) {
        return res.status(404).json({ error: 'Autor no encontrado' });
      }

      const librosPromises = autores.map((autor) =>
        autor.getLibros({
          where: {
            titulo: {
              [Op.iLike]: `%${nombreLibro}%`
            }
          }
        })
      );

      const libros = await Promise.all(librosPromises);
      
      const nombresAutores = autores.map((autor) => autor.nombre);
      return res.status(200).json({ nombreAutor: nombresAutores, libros: libros.flat() });
   }


   if (!nombreAutor && nombreLibro) {
    const libros = await Libro.findAll({
      where: {
        titulo: {
          [Op.iLike]: `%${nombreLibro}%`
        }
      },
      include: {
        model: Usuario,
        attributes: ['nombre']
      }
    });
  
    const librosConAutores = await Promise.all(
      libros.map(async (libro) => {
        const autores = await libro.getUsuarios();
        return {
          libro: libro,
          autores: autores
        };
      })
    );
  
    return res.status(200).json(librosConAutores);
  }

  if(nombreAutor && !nombreLibro){
    const autores = await Usuario.findAll({
      where: {
        nombre: {
          [Op.iLike]: `%${nombreAutor}%`
        }
      },
      include: {
        model: Libro,
        through: {
          attributes: []
        },  
      }
    });
      
    return res.status(200).json(autores);
  }

  if(!nombreAutor && !nombreLibro){
    const libros = await Libro.findAll()

    res.status(200).json(libros)
  }
  
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al obtener los libros del autor' });
  }
});


router.get('/:idUsuario', async (req, res) => {
  try {
    const idUsuario = req.params.idUsuario;
    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const libros = await usuario.getLibros();
    return res.status(200).json({ libros: libros });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener los libros del autor' });
  }
});


router.put("/libros/:id", async (req, res) => {
  try {
    const libroUpdate = await Libros.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (libroUpdate) {
      let data = { ...req.body };

      let keys = Object.keys(data);

      keys.forEach((k) => {
        libroUpdate[k] = data[k];
      });

      await libroUpdate.save();

      res.status(200).send(libroUpdate);
    } else {
      res.status(404);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
