// Setup multer (files will temporarily be saved in the "temp" folder).
const path = require("path");
const multer = require("multer");
const upload = multer({
  dest: path.join(__dirname, "temp")
});

module.exports = upload;