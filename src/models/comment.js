const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comment', {
    commentID: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
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
    authorName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dateComment: {
      type: DataTypes.DATE,
      allowNull: false
    },
    proID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'product',
        key: 'proID'
      }
    },
    sumary: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    com: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'comment',
    timestamps: true,
    paranoid: true,
    timestamp: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "commentID" },
        ]
      },
      {
        name: "fk_comment_Product",
        using: "BTREE",
        fields: [
          { name: "proID" },
        ]
      },
      {
        name: "fk_comment_user",
        using: "BTREE",
        fields: [
          { name: "userID" },
        ]
      },
    ]
  });
};
