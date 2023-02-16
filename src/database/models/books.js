'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Books.belongsToMany(models.Members, {
      //   through: "MembersBorrowBooks",
      //   foreignKey: {
      //     name: "book_code",
      //   },
      //   as: "book_code",
      // })
      Books.hasMany(models.MembersBorrowBooks, {
        foreignKey: 'book_code',
        as: 'borrows'
      });
    }
  }
  Books.init({
    code: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false
    },
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    stock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Books',
  });
  return Books;
};