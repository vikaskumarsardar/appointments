const express = require("express");
const path = require("path");
const { constants } = require("./constants/");
const multer = require('multer')
module.exports = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    constants.paths.banners,
    express.static(path.resolve(constants.paths.bannerUploads))
  );
  require("./database/connection");
  app.use("/api", require("./routes"));
};
