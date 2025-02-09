const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const EventSchema = new mongoose.Schema({
  admin: { type: String, required: true },
  adminemail: { type: String, required: true },
  eventname: { type: String, required: true },
  eventdesc: { type: String, required: true },
  eventdate: { type: Date, required: true },
  eventmemberscapacity: { type: Number, required: true },
  members: [
    {
      type: String,
    },
  ],
});

const EventModel = model("Event", EventSchema);

module.exports = EventModel;
