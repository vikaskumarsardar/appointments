const { messages } = require("../messages");
const { statusCodes } = require("../statusCodes");
const { sendErrorResponse, sendResponse } = require("../lib");
const { eventModel } = require("../models");
const { constants } = require("../constants");
const fs = require("fs");
const path = require("path");

exports.addEvent = async (req, res) => {
  try {
    const foundEvents = await eventModel
      .find({
        "venue.startDateAndTime": new Date(req.body["venue.startDateAndTime"]),
        "venue.endDateAndTime": new Date(req.body["venue.endDateAndTime"]),
        "hostInfo.email": req.body["hostInfo.email"],
      })
      .lean()
      .exec();

    if (foundEvents.length > 0) {
      fs.unlink(
        path.resolve(`${constants.paths.bannerUploads}/${req.file.filename}`),
        (err) => {
          console.log(path.resolve(`${constants.paths.bannerUploads}/${req.file.filename}`))
          if (err) throw err;
          console.log("successfully removed file");
        }
      );
      return sendResponse(
        req,
        res,
        statusCodes.BAD_REQUEST,
        messages.EVENT_ALREADY_EXISTS
      );
    }
    req.body["venue.startDateAndTime"] = new Date(
      req.body["venue.startDateAndTime"]
    );
    req.body["venue.endDateAndTime"] = new Date(
      req.body["venue.endDateAndTime"]
    );
    const newEvent = new eventModel(req.body);
    newEvent.eventTitle.eventBanner = req.file
      ? `${constants.paths.banners}${req.file?.filename}`
      : "";
    const savedEvent = await newEvent.save();
    sendResponse(req, res, statusCodes.CREATED, messages.CREATED, savedEvent);
  } catch (err) {
    console.log(err);

    sendErrorResponse(
      req,
      res,
      statusCodes.INTERNAL_SERVER_ERROR,
      messages.INTERNAL_SERVER_ERROR
    );
  }
};

exports.editEvent = async (req, res) => {
  try {
    const image = req.file?.filename;
    req.body["eventTitle.eventBanner"] =
      image && `${constants.paths.banners}${image}`;
    console.log(image, req.body["eventTitle.eventBanner"]);

    const foundEvents = await eventModel
      .updateOne(
        { _id: req.query.id, isCompleted: false, isDeleted: false },
        { $set: req.body }
      )
      .lean()
      .exec();

    console.log(foundEvents);
    return foundEvents.matchedCount === 1 && foundEvents.modifiedCount === 1
      ? sendResponse(req, res, statusCodes.OK, messages.UPDATED_SUCCESSFULLY)
      : foundEvents.matchedCount === 1
      ? sendResponse(
          req,
          res,
          statusCodes.BAD_REQUEST,
          messages.ALREADY_UPTODATE
        )
      : sendResponse(
          req,
          res,
          statusCodes.BAD_REQUEST,
          messages.NO_EVENTS_FOUND
        );
  } catch (err) {
    console.log(err);
    sendErrorResponse(
      req,
      res,
      statusCodes.INTERNAL_SERVER_ERROR,
      messages.INTERNAL_SERVER_ERROR
    );
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    console.log(req.query);
    const foundEvents = await eventModel
      .updateOne(
        { _id: req.query.id, isCompleted: false, isDeleted: false },
        { $set: { isDeleted: true } }
      )
      .lean()
      .exec();
    return foundEvents.matchedCount === 1
      ? sendResponse(req, res, statusCodes.OK, messages.DELETED_SUCCESSFULLY)
      : sendResponse(
          req,
          res,
          statusCodes.BAD_REQUEST,
          messages.NO_EVENTS_FOUND
        );
  } catch (err) {
    sendErrorResponse(
      req,
      res,
      statusCodes.INTERNAL_SERVER_ERROR,
      messages.INTERNAL_SERVER_ERROR
    );
  }
};

exports.getEvents = async (req, res) => {
  try {
    const search = req.body.search || "";
    const limit = parseInt(req.body.limit) || 10;
    const skip = Math.max((parseInt(req.body.page) || 1) - 1, 0) * limit;

    const query = { isDeleted: false, isCanceled: false };
    query.$or = [
      {
        eventTitle: { $regex: search, $options: "$i" },
      },
      {
        city: {
          $regex: search,
          $options: "$i",
        },
      },
      {
        state: {
          $regex: search,
          $options: "$i",
        },
      },
    ];

    const eventCounts = await eventModel.countDocuments(query).exec();
    const foundEvents = await eventModel
      .find(query, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
        "ticketInfo.totalIncome": 0,
      })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const pageCount = Math.ceil(eventCounts / limit);
    const message =
      eventCounts > 0 ? messages.SUCCESS : messages.NO_EVENTS_FOUND;
    sendResponse(req, res, statusCodes.OK, message, {
      eventCounts,
      pageCount,
      data: foundEvents,
    });
  } catch (err) {
    sendErrorResponse(
      req,
      res,
      statusCodes.INTERNAL_SERVER_ERROR,
      messages.INTERNAL_SERVER_ERROR
    );
  }
};
