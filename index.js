const server = require("./src/app.js");
const { conn, Genero } = require("./src/db.js");

const PORT = process.env.PORT || 3001

const initiateTables = async () => {

let generos = [
  {
    id: 1,
    nombre: "Terror"
  },
  {
    id: 2,
    nombre: "Novela"
  },
  {
    id: 3,
    nombre: "Policial"
  },
  {
    id: 4,
    nombre: "Ciencia Ficcion"
  },
  {
    id: 5,
    nombre: "Erotico"
  },
  {
    id: 6,
    nombre: "Suspenso"
  }
];

generos.forEach(async (element) => {
  await Genero.findOrCreate({
    where: {
      id: element.id,
      nombre: element.nombre
    }
  })
})


}


conn.sync({ force: false }).then(() => {

  initiateTables()

  server.listen(PORT, () => {
    console.log("%s listening at 3001");
  });
});
