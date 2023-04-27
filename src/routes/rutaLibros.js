const { Router } = require("express");
const { Libro, Usuario } = require("../db.js");
const router = Router();


router.post('/', async (req, res) => {
  try {
    const {isbn, titulo, sinopsis, fecha, cantidadDePaginas, imagenDeTapa, linkDescarga, autores } = req.body;

    console.log("autores es: ", autores)
    if(!isbn || !titulo || !sinopsis || !fecha || !cantidadDePaginas || !imagenDeTapa || !linkDescarga || !autores){
      res.status(400).json({msg: "Datos faltantes para crear un libro"})
    }else {

      const libroEncontrado = await Libro.findOne({
        where: {
          isbn
        }
      })

      if(!libroEncontrado){
        const libro = Libro.create({
          isbn,
          titulo,
          sinopsis,
          fecha,
          cantidadDePaginas,
          imagenDeTapa,
          activo: true,
          linkDescarga
        });

        res.status(200).json(libro)
      }else {
        res.status(400).json({msg: 'El libro ya esta dado de alta con ese ISBN'})
      }
    }

  }catch(error){
    res.status(400).json({error: error.message})
  }
})

router.get("/libros", async (req, res) => {
  try {
    const libroData = await Libros.findAll();

    if (libroData) {
      res.status(200).json(libroData);
    } else {
      res.status(400);
      s;
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/libros", async (req, res) => {
  if (!req.body) {
    res.status(400).send("No se enviaron datos en la solicitud.");
    return;
  }

  console.log(req.body);
  const { name, category, Image, link } = req.body;

  try {
    const datos = await Libros.create({
      name,
      category,
      Image,
      link,
    });
    res.status(200).json(datos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Ha ocurrido un error al crear el libro.");
  }
});

router.get("/libros/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pdf = await Libros.findByPk(id);

    if (!pdf) {
      return res.status(404).json({ error: "no libro" });
    }

    res.status(200).json(pdf);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "no libro" });
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
