const cloudinary = require("../config/cloudinary");

const uploadFile = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const file = req.files.image;

    const result = await cloudinary.uploader.upload(file.tempFilePath);

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
      message: "Upload successful",
    });
  } catch (error) {
    console.error("Error uploading file:", error);

    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ message: "public_id is required" });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result !== "ok") {
      return res.status(400).json({
        message: "Failed to delete image",
        result,
      });
    }

    res.status(200).json({
      message: "Image deleted successfully",
      result,
    });
  } catch (error) {
    console.error("Error deleting file:", error);

    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
};

module.exports = {
  uploadFile,
  deleteFile,
};
