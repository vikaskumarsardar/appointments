const {
  createAppointment,
  getAppointments,
  getAllAppointments,
} = require("./appointment");
const { addEvent, deleteEvent, editEvent, getEvents } = require("./event");
module.exports = {
  createAppointment: createAppointment,
  getAppointments: getAppointments,
  getAllAppointments,
  addEvent,
  deleteEvent,
  editEvent,
  getEvents,
};
