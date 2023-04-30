require('dotenv').config();
const { Sequelize, Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

const {
  DB_USER, DB_PASSWORD, DB_HOST,
  URL
} = process.env;

const sequelize = new Sequelize(URL, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});

// const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/gamersStore`, {
//   logging: false, // set to console.log to see the raw SQL queries
//   native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// });
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

modelDefiners.forEach(model => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);


const { Bajada, Calificacion, Genero, Libro, Subida, Usuario } = sequelize.models;

Usuario.belongsToMany(Libro, {through: "libro_autor"})
Libro.belongsToMany(Usuario, {through: "libro_autor"})

Usuario.belongsToMany(Libro, {through: Subida });
Libro.belongsToMany(Usuario, {through: Subida });

Usuario.belongsToMany(Libro, {through: Bajada });
Libro.belongsToMany(Usuario, {through: Bajada });

Libro.hasMany(Calificacion);
Calificacion.belongsTo(Libro);

Libro.belongsToMany(Genero, {through: "libro_genero"});
Genero.belongsToMany(Libro, {through: "libro_genero"});

Usuario.hasMany(Calificacion);
Calificacion.belongsTo(Usuario);





module.exports = {
  ...sequelize.models, 
  conn: sequelize, 
};
