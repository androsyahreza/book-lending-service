const { MembersBorrowBooks } = require("../../database/models/index");
const Sequelize = require("sequelize");

const CountBorrowedBook = async (memberCode) => {
  return await MembersBorrowBooks.findAll({
    attributes: [
      [Sequelize.fn("COUNT", Sequelize.col("member_code")), "borrow"],
    ],
    where: { member_code: memberCode, return_date: null },
  });
};

const BorrowedBook = async (memberCode) => {
  return await MembersBorrowBooks.findAll({
    attributes: [
      "member_code",
      "book_code",
      "borrow_date",
      "expected_return_date",
      "return_date",
    ],
    where: {
      member_code: memberCode,
      return_date: { [Sequelize.Op.not]: null },
    },
  });
};

const BorrowedBookByOther = async (memberCode, bookCode) => {
  return await MembersBorrowBooks.findAll({
    where: {
      member_code: { [Sequelize.Op.not]: memberCode },
      book_code: bookCode,
      return_date: null,
    },
  });
};

const BorrowBook = async (data) => {
  return await MembersBorrowBooks.create(data);
};

const ReturnBook = async (memberCode, bookCode, returnDate) => {
  return await MembersBorrowBooks.update(
    {
      return_date: returnDate,
    },
    {
      where: {
        member_code: memberCode,
        book_code: bookCode,
      },
    }
  );
};

const CheckBorrowedBook = async (memberCode, bookCode) => {
  return await MembersBorrowBooks.findAll({
    where: {
      member_code: memberCode,
      book_code: bookCode,
      return_date: null
    },
  });
};

const CheckReturnedBook = async (memberCode, bookCode) => {
  return await MembersBorrowBooks.findAll({
    where: {
      member_code: memberCode,
      book_code: bookCode,
      return_date: { [Sequelize.Op.not]: null },
    },
  });
};


module.exports = {
  CountBorrowedBook,
  BorrowedBookByOther,
  BorrowedBook,
  BorrowBook,
  CheckBorrowedBook,
  ReturnBook,
  CheckReturnedBook
};
