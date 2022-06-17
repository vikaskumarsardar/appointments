const mongoose = require("mongoose");
const ticketSchema = new mongoose.Schema(
  {
    ticketType: {
      type: String,
      default: "paid",
    },
    ticketHolderName: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    eventId: {
      type: mongoose.Types.ObjectId,
      ref: "event",
    },
  },
  {
    timestamps: true,
  }
);

const ticketModel = mongoose.model("ticket", ticketSchema);
module.exports = ticketModel;
