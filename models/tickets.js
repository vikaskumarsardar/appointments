const mongoose = require("mongoose");
const ticketSchema = new mongoose.Schema(
  {
    ticketType: {
      type: String,
      default: "paid",
    },
    name: {
      type: String,
      default: "",
    },
    availableQuantity: {
      type: Number,
      default: 0,
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

const ticketModel = mongoose.model("ticket", ticketSchema);
module.exports = ticketModel;
