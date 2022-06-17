const { messages } = require("../messages");
const { statusCodes } = require("../statusCodes");
const { sendErrorResponse, sendResponse } = require("../lib");
const { eventModel } = require("../models");
const { countDocuments } = require("../models/appointments");

exports.addEvent = async (req, res) => {
  try {
    const newEvent = new eventModel(req.body);
    const savedEvent = await newEvent.save();
    sendResponse(req, res, statusCodes.CREATED, messages.CREATED, savedEvent);
  } catch (err) {
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
    const foundEvents = await eventModel
      .updateOne(
        { _id: req.params._id, isCompleted: false },
        { $set: req.body },
        { upsert: true }
      )
      .lean()
      .exec();
    return foundEvents.matchedCount === 1
      ? sendResponse(req, res, statusCodes.OK, messages.UPDATED_SUCCESSFULLY)
      : sendResponse(req, res, statusCodes.CREATED, messages.CREATED);
  } catch (err) {
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
    const foundEvents = await eventModel
      .updateOne(
        { _id: req.params._id, isCompleted: false, isDeleted: false },
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
      .find(query)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const pageCount = Math.ceil(countDocuments / limit);
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
