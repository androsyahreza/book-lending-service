"use strict";
const { Model } = require("sequelize");
let counter = 0;

module.exports = (sequelize, DataTypes) => {
  class Members extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Members.belongsToMany(models.Books, {
      //   through: "MembersBorrowBooks",
      //   foreignKey: "member_code", 
      //   otherKey: "book_code", 
      //   as: "member_borrow",
      // });
      Members.hasMany(models.MembersBorrowBooks, {
        foreignKey: 'member_code',
        as: 'MembersBorrowBooks'
      });
    }
  }
  Members.init(
    {
      code: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true
      },
      name: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate: async (Members, options) => {
          counter++;
          Members.code = "M" + counter.toString().padStart(3, "0");
        },
      },
      sequelize,
      modelName: "Members",
    }
  );
  return Members;
};
