const mongoose = require("mongoose");
const User = require("./userSchema");

const Schema = mongoose.Schema;

const commentFormat = new Schema(
  {
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
      default: 0,
    },
    product_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

commentFormat.statics.typeComment = async function (
  user_id,
  comment,
  rating,
  product_id
) {
  /*
    findout who is typing
    add his comment
  */

  const user = await User.findById(user_id).select("username");

  const newComment = await this.create({
    username: user.username,
    comment: comment,
    rating: rating,
    product_id: product_id,
  });

  return newComment;
};

commentFormat.statics.fetchComments = async function (product_id) {
  if (!mongoose.Types.ObjectId.isValid(product_id)) {
    throw new Error("Invalid product_id");
  }

  const comments = await this.find({ product_id });

  return comments;
};

module.exports = {
  commentFormat: mongoose.model(
    "commentFormat",
    commentFormat,
    "commentFormats"
  ),
};
