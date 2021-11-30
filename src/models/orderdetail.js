const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orderdetail', {
    orderDetailID: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    orderID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'order',
        key: 'orderID'
      }
    },
    proID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'detail',
        key: 'proID'
      }
    },
    detailID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'detail',
        key: 'detailID'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'orderdetail',
    timestamps: true,
    paranoid: true,
    timestamp: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "orderDetailID" },
        ]
      },
      {
        name: "fk_OrderDetail_detail",
        using: "BTREE",
        fields: [
          { name: "detailID" },
          { name: "proID" },
        ]
      },
      {
        name: "fk_OrderDetail_order",
        using: "BTREE",
        fields: [
          { name: "orderID" },
        ]
      },
    ]
  });
};
