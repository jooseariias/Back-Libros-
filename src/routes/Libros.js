const { Router } = require("express");
const { Libros } = require("../db.js");
const router = Router();

router.get("/libro", async (req, res) => {
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
      link
    });
    res.status(200).json(datos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Ha ocurrido un error al crear el libro.");
  }
});

module.exports = router;
