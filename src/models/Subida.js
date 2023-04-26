const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('subida', {
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
  });
};
