const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order', {
    orderID: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'f_ID'
      }
    },
    ShippingID: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    payment: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    total: {
      type: DataTypes.BIGINT,
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
    },
    request: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'order',
    timestamps: true,
    paranoid: true,
    timestamp: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "orderID" },
        ]
      },
      {
        name: "fk_order_user",
        using: "BTREE",
        fields: [
          { name: "userID" },
        ]
      },
    ]
  });
};
