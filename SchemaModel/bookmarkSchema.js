const mongoose = require("mongoose");
const { propertyFormat } = require("./propertySchema");

const Schema = mongoose.Schema;

const bookmarkSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    productId: {
      type: [mongoose.Types.ObjectId],
      ref: "propertyFormat",
      required: true,
    },
  },
  { timestamps: true }
);

bookmarkSchema.statics.addBookmark = async function (userId, productId) {
  // Validate userId and productId as ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  // Check if a bookmark document exists for the user

  let bookmark = await this.findOne({ userId });

  if (!bookmark) {
    // If no document exists, create a new one
    bookmark = await this.create({
      userId: userId,
      productId: [productId],
    });

    // Populate productId after creation (optional to limit fields)
    return bookmark.populate("productId"); // Adjust which fields to populate
  }

  // Check if the productId does not exists in the array
  if (!bookmark.productId.includes(productId)) {
    // if productId exists, then check if the bookmark is full (10 properties max)
    if (bookmark.productId.length >= 10) {
      throw new Error("Maximum number of bookmarks reached");
    }

    bookmark.productId.push(productId); // Append the new productId
    await bookmark.save();
  } else if (bookmark.productId.includes(productId)) {
    // if the productId is already in the bookmark list, then throw the error below
    throw new Error("This property is already added to your bookmarks");
  }

  // Return the bookmark with populated productId
  return bookmark.populate("productId"); // Adjust which fields to populate
};

bookmarkSchema.statics.getAllBookmarks = async function (userId, sortMethod) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId format");
  }

  // Step 1: Get the product (property) IDs from bookmarks
  const userBookmarks = await this.findOne({ userId })
    .select("productId")
    .lean();

  if (!userBookmarks || !userBookmarks.productId.length) {
    return []; // No bookmarks found
  }

  // Step 2: Fetch the full property details using the product IDs
  const properties = await propertyFormat
    .find({
      _id: { $in: userBookmarks.productId },
    })
    .lean();

  // Step 3: Apply sorting if needed
  if (sortMethod) {
    const sortFields = {
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      nameAsc: { name: 1 },
      nameDesc: { name: -1 },
    };

    const field = Object.keys(sortFields[sortMethod])[0];
    const order = sortFields[sortMethod][field];

    properties.sort((a, b) => (a[field] > b[field] ? order : -order));
  }

  return properties;
};

bookmarkSchema.statics.removeBookmark = async function (userId, productId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  try {
    const bookmarks = await this.findOne({ userId });

    if (!bookmarks) {
      throw new Error("No user with this userId");
    }

    if (!bookmarks.productId.includes(productId)) {
      throw new Error("No property with this productId");
    }

    bookmarks.productId = bookmarks.productId.filter(
      (prop) => prop.toString() !== productId.toString()
    );
    await bookmarks.save();

    return bookmarks;
  } catch (error) {
    console.error("Error deleting bookmark:", err.message);
    throw new Error("Failed to delete bookmark.");
  }
};

module.exports = {
  bookmarkSchema: mongoose.model("bookmarkSchema", bookmarkSchema, "bookmarks"),
};
