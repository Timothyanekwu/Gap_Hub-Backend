const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Main categories schema
const categorySchema = new Schema(
  {
    Houses: { type: [String] },
    Land: { type: [String] },
    Commercial: { type: [String] },
    Shortlet: { type: [String] },
  },
  { _id: false }
);

// Main filter schema
const filterSchema = new Schema({
  categories: { type: categorySchema },
  //   location: { type: [string] },
  //   priceRange: {
  //     min: { type: Number || null, required: true },
  //     max: { type: Number || null, required: true },
  //   },
});

// Static method to set filter
filterSchema.statics.setFilter = async function () {
  const filter = await this.create({
    categories: {
      Houses: [
        "Apartment",
        "Flats",
        "Duplex",
        "Mini Flat",
        "Townhouse/terrace",
        "Bedsitter",
        "Bungalow",
        "Condo",
        "Farm House",
        "Mansion",
        "Penthouse",
        "Room & parlor",
        "Shared apartment",
        "Studio",
        "Villa",
      ],

      Land: [
        "Commercial land",
        "Farmland",
        "Industrial Land",
        "Mixed-use Land",
        "Quarry",
        "Residential Land",
      ],

      Commercial: [
        "Office space",
        "Shop",
        "Apartment",
        "Warehouse",
        "Open space",
        "Church Space",
        "Complex",
        "Factory",
        "Filling station",
        "Fish ponds",
        "Garage",
        "Hall",
        "Hotel",
        "Maisonette",
        "Mall",
        "Meeting room",
        "Pharmacy",
        "Plaza",
        "Restaurant",
        "Salon",
        "School",
        "Showroom",
        "Supermarket",
        "Tank farm",
        "Workshop",
      ],

      Shortlet: [],
    },
  });

  return filter;
};

// Create the model after defining the schema and static method
const Filter = mongoose.model("Filter", filterSchema);

module.exports = {
  Filter,
};
