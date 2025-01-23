const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
}, { versionKey: false });

const Record = mongoose.model("records", RecordSchema);

module.exports = Record;