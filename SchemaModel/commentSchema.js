const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentFormat = new Schema({
  username: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

module.exports = {
  commentFormat: mongoose.model(
    "commentFormat",
    commentFormat,
    "commentFormats"
  ),
};
