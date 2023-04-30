const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('subida', {
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  });
};
