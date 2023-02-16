const {
  CountBorrowedBook,
  BorrowedBookByOther,
  BorrowedBook,
  CheckBorrowedBook,
  CheckReturnedBook,
} = require("../services/borrow.service");
const moment = require("moment");
const { CheckStock } = require("../services/book.service");

const isMoreThanLimited = async (memberCode) => {
  let result;
  const book = await CountBorrowedBook(memberCode);
  const bookBorrowed = JSON.stringify(book);
  const bookObj = JSON.parse(bookBorrowed)[0].borrow;
  const condition = parseInt(bookObj);
  condition >= 2 ? (result = true) : (result = false);
  return result;
};

const isBorrowedByOther = async (memberCode, bookCode) => {
  let result;
  const book = await BorrowedBookByOther(memberCode, bookCode);
  book.length != 0 ? (result = true) : (result = false);
  return result;
};

const isPenalized = async (memberCode, borrowDate) => {
  const book = await BorrowedBook(memberCode);
  const bookBorrowed = JSON.stringify(book);
  if (book.length == 0) {
    return false;
  } else {
    const expected = JSON.parse(bookBorrowed)[0].expected_return_date;
    const returned = JSON.parse(bookBorrowed)[0].return_date;
    const expectedDate = moment(expected).format("YYYY-MM-DD");
    const returnedDate = moment(returned);
    const momentBorrowDate = moment(borrowDate);
    if (returnedDate.diff(expectedDate, "days") <= 0) {
      return false;
    } else if (momentBorrowDate.diff(expectedDate, "days") > 3) {
      return false;
    } else if (momentBorrowDate.diff(expectedDate, "days") < 1) {
      return false;
    } else {
      return true;
    }
  }
};

const isMyBorrowedBook = async (memberCode, bookCode) => {
  let result;
  const book = await CheckBorrowedBook(memberCode, bookCode);
  book.length != 0 ? (result = true) : (result = false);
  return result;
};

const isGetPenalized = async (memberCode, returnDate) => {
  let result;
  const book = await BorrowedBook(memberCode);
  const bookBorrowed = JSON.stringify(book);
  if (book.length == 0) {
    return false;
  } else {
    const expected = JSON.parse(bookBorrowed)[0].expected_return_date;
    const expectedDate = moment(expected).format("YYYY-MM-DD");
    const returnedDate = moment(returnDate);
    returnedDate.diff(expectedDate, "days") >= 1
      ? (result = true)
      : (result = false);
    return result;
  }
};

const isBeenReturned = async (memberCode, bookCode) => {
  let result;
  const book = await CheckReturnedBook(memberCode, bookCode);
  book.length != 0 ? (result = true) : (result = false);
  return result;
};

const isAvailable = async (bookCode) => {
  let result;
  const book = await CheckStock(bookCode);
  book.stock > 0 ? (result = true) : (result = false);
  return result;
};

module.exports = {
  isMoreThanLimited,
  isBorrowedByOther,
  isPenalized,
  isMyBorrowedBook,
  isGetPenalized,
  isBeenReturned,
  isAvailable,
};
