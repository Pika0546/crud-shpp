const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shipping', {
    shipID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'f_ID'
      }
    },
    f_lastname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    f_firstname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    f_phone: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    province: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    distric: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ward: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'shipping',
    timestamps: true,
    paranoid: true,
    timestamp: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "shipID" },
        ]
      },
      {
        name: "fk_Shipping_Product",
        using: "BTREE",
        fields: [
          { name: "userID" },
        ]
      },
    ]
  });
};
