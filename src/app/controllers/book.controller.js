const { FailedResponse, SuccessResponse } = require("../helpers/api.response");
const BookService = require("../services/book.service");
const status = require("http-status");
const { bookValidator } = require("../validator/validator");

const addBook = async (req, res) => {
  try {
    const bookValidate = bookValidator.validate(req.body);
    const bookValidateError = bookValidate.error;
    if (bookValidateError) {
      res
        .status(status.BAD_REQUEST)
        .send(FailedResponse(status.BAD_REQUEST, bookValidateError.details));
    } else {
      const { code, title, author, stock } = req.body;
    const data = {
      code: code,
      title: title,
      author: author,
      stock: stock,
    };
    const book = await BookService.AddBook(data);
    res
      .status(status.OK)
      .json(SuccessResponse(status.OK, "Book Successfully Added", book));
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const viewBook = async (req, res) => {
  try {
    const book = await BookService.ViewBook();
    res.status(status.OK).json(SuccessResponse(status.OK, null, book));
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

module.exports = {
  addBook,
  viewBook,
};
