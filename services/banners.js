const multer = require("multer");
const { messages } = require("../messages");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./banners");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    return cb(
      null,
      file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error(messages.ONLY_IMAGE));
  }
};

const banners = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = {
    banners : banners.single('image')
}