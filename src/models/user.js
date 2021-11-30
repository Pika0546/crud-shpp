const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    f_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    f_userName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    f_password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    f_lastname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    f_firstname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    f_address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    f_email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    f_phone: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    f_DOB: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    f_permission: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    f_sex: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: true,
    paranoid: true,
    timestamp: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "f_ID" },
        ]
      },
    ]
  });
};
