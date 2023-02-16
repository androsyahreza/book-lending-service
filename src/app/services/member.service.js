const { Members } = require("../../database/models/index");
const { MembersBorrowBooks } = require("../../database/models/index");
const Sequelize = require("sequelize");

const AddMember = async (data) => {
  return await Members.create(data, { returning: true });
};

const ViewMember = async () => {
  return await Members.findAll({
    attributes: [
      "code", 
      "name", 
      [Sequelize.fn("COUNT", Sequelize.col("MembersBorrowBooks.member_code")), "total_borrowed"]
    ],
    include: [
      {
        model: MembersBorrowBooks,
        as: "MembersBorrowBooks",
        attributes: [],
        where: {
          return_date : null
        },
        required:false
      }
    ],
    group: ["Members.code", "Members.name"]
  });
};

module.exports = {
  AddMember,
  ViewMember,
};
