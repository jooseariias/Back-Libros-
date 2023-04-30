const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('genero', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    // descripcion: {
    //   type: DataTypes.TEXT,
    //   allowNull: false
    // },
 });
};
