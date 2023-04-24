const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('libros', {
    
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('CuentosyNovelas', 'Terror', 'Adolecentes', 'CienciaFieccion',),
      allowNull: false
    },
    Image: {
        type: DataTypes.STRING, 
        allowNull: true,
      },
    link: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
  });
};
