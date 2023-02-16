'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MembersBorrowBooks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MembersBorrowBooks.belongsTo(models.Members, {
        foreignKey: 'member_code',
        as: 'member',
      });
      MembersBorrowBooks.belongsTo(models.Books, {
        foreignKey: 'book_code',
        as: 'book',
      });
    }
  }
  MembersBorrowBooks.init({
    member_code: DataTypes.STRING,
    book_code: DataTypes.STRING,
    borrow_date: DataTypes.DATE,
    expected_return_date: DataTypes.DATE,
    return_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'MembersBorrowBooks',
  });
  return MembersBorrowBooks;
};