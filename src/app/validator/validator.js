const Joi = require("joi").extend(require("@joi/date"));

const memberValidator = Joi.object().keys({
  name: Joi.string().min(2).required(),
});

const bookValidator = Joi.object().keys({
  code: Joi.string()
    .regex(/([A-Za-z]+)-(\d+)/)
    .required(),
  title: Joi.string().min(2).required(),
  author: Joi.string().min(2).required(),
  stock: Joi.number().min(0).required(),
});

const borrowValidator = Joi.object().keys({
  member_code: Joi.string().min(2).required(),
  book_code: Joi.string()
  .regex(/([A-Za-z]+)-(\d+)/)
  .required(),
  borrow_date: Joi.date().format("YYYY-MM-DD").utc(),
});

const returnValidator = Joi.object().keys({
  member_code: Joi.string().min(2).required(),
  book_code: Joi.string()
  .regex(/([A-Za-z]+)-(\d+)/)
  .required(),
  return_date: Joi.date().format("YYYY-MM-DD").utc(),
});

module.exports = {
  memberValidator,
  bookValidator,
  borrowValidator,
  returnValidator
};
