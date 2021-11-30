var DataTypes = require("sequelize").DataTypes;
var _brand = require("./brand");
var _cart = require("./cart");
var _category = require("./category");
var _comment = require("./comment");
var _detail = require("./detail");
var _imagelink = require("./imagelink");
var _order = require("./order");
var _orderdetail = require("./orderdetail");
var _product = require("./product");
var _shipping = require("./shipping");
var _user = require("./user");

function initModels(sequelize) {
  var brand = _brand(sequelize, DataTypes);
  var cart = _cart(sequelize, DataTypes);
  var category = _category(sequelize, DataTypes);
  var comment = _comment(sequelize, DataTypes);
  var detail = _detail(sequelize, DataTypes);
  var imagelink = _imagelink(sequelize, DataTypes);
  var order = _order(sequelize, DataTypes);
  var orderdetail = _orderdetail(sequelize, DataTypes);
  var product = _product(sequelize, DataTypes);
  var shipping = _shipping(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  product.belongsTo(brand, { as: "brand", foreignKey: "brandID"});
  brand.hasMany(product, { as: "products", foreignKey: "brandID"});
  product.belongsTo(category, { as: "cat", foreignKey: "catID"});
  category.hasMany(product, { as: "products", foreignKey: "catID"});
  cart.belongsTo(detail, { as: "detail", foreignKey: "detailID"});
  detail.hasMany(cart, { as: "carts", foreignKey: "detailID"});
  cart.belongsTo(detail, { as: "pro", foreignKey: "proID"});
  detail.hasMany(cart, { as: "pro_carts", foreignKey: "proID"});
  orderdetail.belongsTo(detail, { as: "detail", foreignKey: "detailID"});
  detail.hasMany(orderdetail, { as: "orderdetails", foreignKey: "detailID"});
  orderdetail.belongsTo(detail, { as: "pro", foreignKey: "proID"});
  detail.hasMany(orderdetail, { as: "pro_orderdetails", foreignKey: "proID"});
  orderdetail.belongsTo(order, { as: "order", foreignKey: "orderID"});
  order.hasMany(orderdetail, { as: "orderdetails", foreignKey: "orderID"});
  comment.belongsTo(product, { as: "pro", foreignKey: "proID"});
  product.hasMany(comment, { as: "comments", foreignKey: "proID"});
  detail.belongsTo(product, { as: "pro", foreignKey: "proID"});
  product.hasMany(detail, { as: "details", foreignKey: "proID"});
  imagelink.belongsTo(product, { as: "pro", foreignKey: "proID"});
  product.hasMany(imagelink, { as: "imagelinks", foreignKey: "proID"});
  cart.belongsTo(user, { as: "user", foreignKey: "userID"});
  user.hasMany(cart, { as: "carts", foreignKey: "userID"});
  comment.belongsTo(user, { as: "user", foreignKey: "userID"});
  user.hasMany(comment, { as: "comments", foreignKey: "userID"});
  order.belongsTo(user, { as: "user", foreignKey: "userID"});
  user.hasMany(order, { as: "orders", foreignKey: "userID"});
  shipping.belongsTo(user, { as: "user", foreignKey: "userID"});
  user.hasMany(shipping, { as: "shippings", foreignKey: "userID"});

  return {
    brand,
    cart,
    category,
    comment,
    detail,
    imagelink,
    order,
    orderdetail,
    product,
    shipping,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
