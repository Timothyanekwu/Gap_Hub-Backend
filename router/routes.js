const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const { Filter } = require("../SchemaModel/filterSchema");
const { propertyFormat } = require("../SchemaModel/propertySchema");
const { getProperties } = require("../controllers/listControllers");
const { bookmarkSchema } = require("../SchemaModel/bookmarkSchema");
const { commentFormat } = require("../SchemaModel/commentSchema");

// const User = require("../SchemaModel/userModel");
// const mongoose = require("mongoose");

// Routes
// router.use(requireAuth);

// addProperty
router.post("/addProperty", async (req, res) => {
  const { name, image, price, category, subCategory, type, location, tags } =
    req.body;

  if (
    !name ||
    !image ||
    !price ||
    !category ||
    !type ||
    !location ||
    !tags ||
    !subCategory
  ) {
    throw new Error("all fields not filled");
  }

  try {
    const result = await propertyFormat.create({
      name,
      image,
      price,
      category,
      subCategory,
      type,
      location,
      tags,
      comments: [],
      description: "",
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// get property

router.get("/filters", async (req, res) => {
  try {
    const filters = await Filter.find({});
    res.status(200).json(filters);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// router.post("/filters", async (req, res) => {
//   try {
//     const filter = await Filter.setFilter();
//     console.log(filter);
//     res.status(200).send("Filter data initialized successfully!");
//   } catch (err) {
//     console.error("Error initializing filter data:", err);
//     res.status(500).send("An error occurred while initializing filter data.");
//   }
// });

// List apartments (to be worked on)
router.get("/getProperties", async (req, res) => {
  const bod = req.query;

  // for searching a product
  const query = {};
  if (bod.query) {
    const searchTerm = bod.query.trim();

    query.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { category: { $regex: searchTerm, $options: "i" } },
      { type: { $regex: searchTerm, $options: "i" } },
      { tags: { $regex: searchTerm, $options: "i" } },
    ];
  }

  // Price range filter
  if (bod.priceRange) {
    const priceRange = bod.priceRange.split(",").map(Number);

    query.price = { $gte: priceRange[0], $lte: priceRange[1] };
  }

  // categories filter
  if (bod.category) {
    query.subCategory = bod.category;
  }

  // type filter
  if (bod.type) {
    query.type = bod.type;
  }

  try {
    // Calculate the total count based on the constructed query
    const totalProduct = await propertyFormat.countDocuments(query);

    // Define page size and calculate the start index based on the requested page
    const pageSize = 10;
    const page = parseInt(bod.page) || 1; // Default page to 1 if not specified
    const startIndex = (page - 1) * pageSize;

    // Define sorting logic
    let sortOptions = {};
    if (bod.sortBy) {
      if (bod.sortBy === "priceAsc") {
        sortOptions = { price: 1 };
      } else if (bod.sortBy === "priceDesc") {
        sortOptions = { price: -1 };
      } else if (bod.sortBy === "nameAsc") {
        sortOptions = { name: 1 };
      } else if (bod.sortBy === "nameDesc") {
        sortOptions = { name: -1 };
      }
    }

    const products = await propertyFormat
      .find(query)
      .sort(sortOptions)
      .skip(startIndex)
      .limit(pageSize);

    res.status(200).json({
      data: products,
      totalPages: Math.ceil(totalProduct / pageSize),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// similar listings
router.get("/similarListings", async (req, res) => {
  const { productId } = req.query;

  try {
    // Fetch the current product
    const currentProduct = await propertyFormat.findById(productId);
    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Initialize the query for similar products using subCategory
    let query = {
      tags: currentProduct.subCategory,
      _id: { $ne: productId }, // Exclude the current product
    };

    // Fetch similar products using tags
    let similarProducts = await propertyFormat.find(query).limit(6);

    // If fewer than 6 matches are found, search using the tags
    if (similarProducts.length < 6) {
      let query = {
        tags: { $all: currentProduct.tags },
        _id: { $ne: productId }, // Exclude the current product
        $expr: { $eq: [{ $size: "$tags" }, currentProduct.tags.length] },
      }; // Ensure the array lengths match };
      const additionalProducts = await propertyFormat
        .find(query)
        .limit(6 - similarProducts.length);
      similarProducts = similarProducts.concat(additionalProducts);
    }

    // If fewer than 6 matches are found, search using the category
    if (similarProducts.length < 6) {
      let query = {
        category: currentProduct.category,
        _id: { $ne: productId }, // Exclude the current product
      }; // Ensure the array lengths match };
      const additionalProducts = await propertyFormat
        .find(query)
        .limit(6 - similarProducts.length);
      similarProducts = similarProducts.concat(additionalProducts);
    }

    res.status(200).json({ products: similarProducts });
  } catch (error) {
    console.error("Error fetching similar listings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/comment", async (req, res) => {
  try {
    const { product_id } = req.query;

    const comments = await commentFormat.fetchComments(product_id);
    res.status(200).json({ comments });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
