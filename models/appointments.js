const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    dateAndTime: {
      type: Date,
      default: new Date(Date.now() + 4 * 1000 * 60 * 60),
    },
    isCanceled: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const appointmentModel = mongoose.model("appointment", appointmentSchema);
module.exports = appointmentModel;
