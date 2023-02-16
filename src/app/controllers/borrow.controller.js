const { FailedResponse, SuccessResponse } = require("../helpers/api.response");
const { borrowValidator, returnValidator } = require("../validator/validator");
const BorrowService = require("../services/borrow.service");
const BookService = require("../services/book.service");
const status = require("http-status");
const moment = require("moment");

const {
  isMoreThanLimited,
  isBorrowedByOther,
  isPenalized,
  isMyBorrowedBook,
  isGetPenalized,
  isBeenReturned,
  isAvailable,
} = require("../helpers/borrow-condition");

const borrowBook = async (req, res) => {
  try {
    const borrowValidate = borrowValidator.validate(req.body);
    const borrowValidateError = borrowValidate.error;
    if (borrowValidateError) {
      res
      .status(status.BAD_REQUEST)
      .send(FailedResponse(status.BAD_REQUEST, borrowValidateError.details));
    }
    
    const { member_code, book_code, borrow_date } = req.body;
    const memberCode = member_code;
    const bookCode = book_code;
    const borrowDate = borrow_date;

    if (await isMoreThanLimited(memberCode)) {
      return res
        .status(status.BAD_REQUEST)
        .json(FailedResponse(status.BAD_REQUEST, "A member may not borrow more than 2 books!"));
    }

    if (!await isAvailable(bookCode)) {
      return res
        .status(status.BAD_REQUEST)
        .json(FailedResponse(status.BAD_REQUEST, "The book not available!"));
    }

    if (await isBorrowedByOther(memberCode, bookCode)) {
      return res
        .status(status.BAD_REQUEST)
        .json(FailedResponse(status.BAD_REQUEST,"A member may not borrow a book that was borrowed by others!"));
    }

    if (await isMyBorrowedBook(memberCode, bookCode)) {
      return res
        .status(status.BAD_REQUEST)
        .json(FailedResponse(status.BAD_REQUEST, "The book has been borrowed!"));
    }

    if (await isPenalized(memberCode, borrowDate)) {
      return res
        .status(status.BAD_REQUEST)
        .json(FailedResponse(status.BAD_REQUEST, "A member may not borrow a book if penalized!"));
    }

    const data = {
      member_code: member_code,
      book_code: book_code,
      borrow_date: borrow_date,
      expected_return_date: moment(borrow_date).add(7, "d").format("YYYY-MM-DD"),
    };

    const borrow = await BorrowService.BorrowBook(data);
    await BookService.ReduceBookStock(bookCode, 1);

    res
      .status(status.OK)
      .json(SuccessResponse(status.OK, "Successfully borrow book!", borrow));
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const returnBook = async (req, res) => {
  try {
    const returnValidate = returnValidator.validate(req.body);
    const returnValidateError = returnValidate.error;
    if (returnValidateError) {
      res
      .status(status.BAD_REQUEST)
      .send(FailedResponse(status.BAD_REQUEST, returnValidateError.details));
    }

    const { member_code, book_code, return_date } = req.body;
    const memberCode = member_code;
    const bookCode = book_code;
    const returnDate = return_date;

    if (await isBeenReturned(memberCode, bookCode)) {
      return res
        .status(status.BAD_REQUEST)
        .json(FailedResponse(status.BAD_REQUEST, "The book has been returned!"));
    }

    if (!(await isMyBorrowedBook(memberCode, bookCode, returnDate))) {
      return res
        .status(status.BAD_REQUEST)
        .json(FailedResponse(status.BAD_REQUEST, "A member may not return others borrowed books!"));
    }

    if (await isGetPenalized(memberCode, returnDate)) {
      await BorrowService.ReturnBook(memberCode, bookCode, returnDate);
      await BookService.AddBookStock(bookCode, 1);
      return res
        .status(status.OK)
        .json(SuccessResponse(status.OK, "Successfully return the book! but unfortunately, you get penalized because of a late return!"));
    } else {
      await BorrowService.ReturnBook(memberCode, bookCode, returnDate);
      await BookService.AddBookStock(bookCode, 1);
      return res
        .status(status.OK)
        .json(SuccessResponse(status.OK, "Successfully return the book!"));
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

module.exports = {
  borrowBook,
  returnBook,
};
