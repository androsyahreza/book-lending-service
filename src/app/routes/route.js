const express = require("express");
const router = express.Router();
const memberController = require("../controllers/member.controller");
const bookController = require("../controllers/book.controller");
const borrowController = require("../controllers/borrow.controller")

// Member Route
router.post("/members", memberController.addMember);
router.get("/members", memberController.viewMember);

// Book Route
router.post("/books", bookController.addBook);
router.get("/books", bookController.viewBook);

// Borrow Route
router.post("/borrow", borrowController.borrowBook);
router.post("/return", borrowController.returnBook);

module.exports = router;
