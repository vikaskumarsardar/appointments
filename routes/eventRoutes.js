const {
  getEvents,
  addEvent,
  deleteEvent,
  editEvent,
} = require("../controllers/");
const { banners } = require("../services");
const express = require("express");
const Router = express.Router();
Router.get("/getEvents", getEvents);
Router.post("/addEvent", banners, addEvent);
Router.delete("/deleteEvent/:_id", deleteEvent);
Router.post("/editEvent/:_id", editEvent);

module.exports = Router;
