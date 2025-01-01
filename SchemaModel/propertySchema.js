const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const propertyFormat = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: [String],
    price: {
      type: Number,
      required: true,
    },
    category: {
      //land, shop, house, mansion, e.t.c
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
    },
    type: {
      // rent, sale, e.t.c
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    tags: [String],
    status: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "commentFormat" }],
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

// const locationsFormat = new Schema(
//   {
//     name: { type: String, required: true },
//     surname: { type: String, required: true },
//     fullAddress: {
//       type: String,
//       required: true,
//     },
//     additionalInfo: { type: String },
//     phoneNo: {
//       type: String,
//       required: true,
//     },
//     additionalPhone: {
//       type: String,
//     },
//     user_id: { type: String },
//   },
//   { timestamps: true }
// );

// const ordersFormat = new Schema(
//   {
//     customerFullName: { type: String, required: true },
//     customerPhone: { type: String, required: true },
//     customerAddress: { type: String, required: true },
//     orderNumber: { type: Number, required: true },
//     // status: {type: String},
//     totalPrice: { type: Number },
//     payMethod: { type: String },
//     user_id: {
//       type: String,
//       required: true,
//     },
//     products: [cartFormat],
//     user_id: { type: String },
//   },
//   { timestamps: true }
// );

module.exports = {
  propertyFormat: mongoose.model(
    "propertyFormat",
    propertyFormat,
    "propertyFormats"
  ),
};
