const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/auth");
const { ensureAuth } = require("../middleware/auth");

//Comment Routes - simplified for now
router.post("/createComment/:id", commentsController.createComment);

module.exports = router;