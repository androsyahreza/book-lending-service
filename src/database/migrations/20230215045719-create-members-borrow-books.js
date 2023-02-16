'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MembersBorrowBooks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      member_code: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Members',
          key: 'code',
          as: 'member_code'
        }
      },
      book_code: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Books',
          key: 'code',
          as: 'book_code'
        }
      },
      borrow_date: {
        type: Sequelize.DATE
      },
      expected_return_date: {
        type: Sequelize.DATE
      },
      return_date: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MembersBorrowBooks');
  }
};