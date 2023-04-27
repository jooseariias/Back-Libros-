const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('libro', {
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    sinopsis: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cantidadDePaginas: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    imagenDeTapa: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    linkDescarga: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};
