const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('calificacion', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: true,
      primaryKey: true
    },
    comentario: {
      type: DataTypes.TEXT, 
      allowNull: false,
    },
    puntuacion: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
  });
};
