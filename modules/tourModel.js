const mongoose = require('mongoose');
const tour = new mongoose.Schema({
  Airport: {
    Code: { type: String, unique: true },
    Name: { type: String, unique: true },
  },
  Time: {
    Label: String,
    Month: { type: Date },
    'Month Name': String,
    Year: { type: Date },
  },
  Statistics: {
    '# of Delays': {
      Carrier: Number,
      'Late Aircraft': Number,
      'National Aviation System': Number,
      Security: Number,
      Weather: Number,
    },
    Carriers: {
      Names: { type: String, trim: true },
      Total: Number,
    },
    Flights: {
      Cancelled: Number,
      Delayed: Number,
      Diverted: Number,
      'On Time': Number,
      Total: Number,
    },
    'Minutes Delayed': {
      Carrier: Number,
      'Late Aircraft': Number,
      'National Aviation System': Number,
      Security: Number,
      Total: Number,
      Weather: Number,
    },
  },
});

const TourModel = mongoose.model('usersU', tour);

module.exports = TourModel;
