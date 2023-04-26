const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

  // defino el modelo

  module.exports = (sequelize) => { sequelize.define('usuario', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    rol: {
      type: DataTypes.ENUM('admin', 'lector', 'escritor', 'ambos'),
      allowNull: false
    },
    habilitado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    resetPasswordCode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true
    },
    instagram: {
        type: DataTypes.STRING,
        allowNull: true
    }
  },
   {
    
    timestamps: true

  })
}

