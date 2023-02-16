const {
  FailedResponse,
  SuccessResponse,
} = require("../src/app/helpers/api.response");
const { bookValidator } = require("../src/app/validator/validator");
const { addBook, viewBook } = require("../src/app/controllers/book.controller");
const BookService = require("../src/app/services/book.service");

jest.mock("../src/app/helpers/api.response", () => ({
  FailedResponse: jest.fn(),
  SuccessResponse: jest.fn(),
}));

jest.mock("../src/app/validator/validator", () => ({
  bookValidator: {
    validate: jest.fn(),
  },
}));
jest.mock("../src/app/services/book.service", () => ({
  AddBook: jest.fn(),
  ViewBook: jest.fn(),
}));

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const req = {
  body: {
    code: "code",
    title: "title",
    author: "author",
    stock: "stock",
  },
};

describe("Add Book endpoint", () => {
  it("Should return 400 if book validation fails", async () => {
    bookValidator.validate = jest.fn().mockReturnValue({
      error: {
        details: "Validation error",
      },
    });
    await addBook(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      FailedResponse(400, "Validation error")
    );
  });
  it("Should return 200 if book successfully added", async () => {
    bookValidator.validate = jest.fn().mockReturnValue({ error: null });
    BookService.AddBook.mockResolvedValue({
      status: 200,
      message: "Book successfully added",
      data: "data",
    });
    await addBook(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      SuccessResponse(200, "Book successfully added", "data")
    );
  });
  it("Should return 500 if an error occurs", async () => {
    BookService.AddBook = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await addBook(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});

describe("View Member endpoint", () => {
  it("Should return 200 if book successfully viewed", async () => {
    BookService.ViewBook.mockResolvedValue({
      status: 200,
      message: null,
      data: "data",
    });
    await viewBook(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(SuccessResponse(200, null, "data"));
  });
  it("Should return 500 if an error occurs", async () => {
    BookService.ViewBook = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await viewBook(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
