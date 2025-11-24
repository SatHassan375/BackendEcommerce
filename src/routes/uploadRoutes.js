// src/routes/uploadRoutes.js
const express = require("express");
const uploadFile = require("../middleware/uploadMiddleware");
const {
  uploadFile: uploadFileController,
  deleteFile,
} = require("../controllers/uploadController");

const router = express.Router();

router.post("/image", uploadFile, uploadFileController);
router.post("/delete/image", uploadFile, deleteFile);

module.exports = router;
