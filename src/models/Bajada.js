const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('bajada', {
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
  });
};
