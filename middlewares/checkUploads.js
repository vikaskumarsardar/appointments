const { sendErrorResponse, sendResponse } = require("../lib");
const { messages } = require("../messages");
const { statusCodes } = require("../statusCodes");
const { eventModel } = require("../models");

exports.checkUploads = async (req, res, next) => {
  try {
    // const data = JSON.stringify(req)
    console.log(req.body, "middleware");

    // console.log(new Date(req.body["venue.startDateAndTime"]),req.body["venue.startDateAndTime"])
    //     const foundEvents = await eventModel
    //       .find({
    //         "venue.startDateAndTime": new Date(req.body["venue.startDateAndTime"]),
    //         "venue.endDateAndTime": new Date(req.body["venue.endDateAndTime"]),
    //         "hostInfo.email": req.body["hostInfo.email"],
    //       })
    //       .lean()
    //       .exec();
    //       if(foundEvents.length > 0) return sendResponse(req,res,statusCodes.BAD_REQUEST,messages.EVENT_ALREADY_EXISTS)
    // return
    next();
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
