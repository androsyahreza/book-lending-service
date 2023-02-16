const { Books } = require("../../database/models/index");
const Sequelize = require("sequelize");

const AddBook = async (data) => {
  return await Books.create(data, { returning: true });
};

const ViewBook = async () => {
  return await Books.findAll({
    attributes: ["code", "title", "author", "stock"],
    where: { stock: { [Sequelize.Op.not]: 0 } },
  });
};

const CheckStock = async (bookCode) => {
  return await Books.findOne({
    attributes: ["stock"],
    where: { code: bookCode },
  });
};

const ReduceBookStock = async (bookCode, value) => {
  const code = bookCode;
  const decrementBy = value;

  return await Books.update(
    { stock: Sequelize.literal(`stock - ${decrementBy}`) },
    { where: { code: code } }
  );
};

const AddBookStock = async (bookCode, value) => {
  const code = bookCode;
  const incrementBy = value;

  return await Books.update(
    { stock: Sequelize.literal(`stock + ${incrementBy}`) },
    { where: { code: code } }
  );
};

module.exports = {
  AddBook,
  ViewBook,
  ReduceBookStock,
  AddBookStock,
  CheckStock,
};
