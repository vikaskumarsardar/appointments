const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema(
  {
    eventTitle: {
      type: String,
      default: "",
    },
    eventType: {
      type: String,
      default: "private",
    },
    isCanceled: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    eventBanner: {
      type: String,
      default: "",
    },
    hostName: {
      type: String,
      default: "",
    },
    hostEmail: {
      type: String,
      default: "",
    },
    mobilePhone: {
      type: String,
      default: "",
    },
    altMobile: {
      type: String,
      default: "",
    },
    startDateAndTime: {
      type: Date,
    },
    endDateAndTime: {
      type: Date,
    },
    location: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    street: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    ZIP: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    ticketType: {
      type: String,
      default: "paid",
    },
    ticketName: {
      type: String,
      default: "",
    },
    availableQuantity: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    totalIncome: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const eventModel = mongoose.model("event", eventSchema);
module.exports = eventModel;
