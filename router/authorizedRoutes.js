const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const { Filter } = require("../SchemaModel/filterSchema");
const { propertyFormat } = require("../SchemaModel/propertySchema");
const { getProperties } = require("../controllers/listControllers");
const { bookmarkSchema } = require("../SchemaModel/bookmarkSchema");
const { commentFormat } = require("../SchemaModel/commentSchema");
const User = require("../SchemaModel/userSchema");
const mongoose = require("mongoose");

// Routes
router.use(requireAuth);

router.get("/verifyToken", (req, res) => {
  const user_id = req.user._id;

  try {
    if (user_id && mongoose.Types.ObjectId.isValid(user_id)) {
      res.status(200).json({ status: true });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/bookmarks", async (req, res) => {
  const { productId } = req.body;
  const user_id = req.user._id;

  try {
    const bookmarks = await bookmarkSchema.addBookmark(user_id, productId);

    res
      .status(200)
      .json({ message: "Property successfully added to bookmarks", bookmarks });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/bookmarks", async (req, res) => {
  const user_id = req.user._id;
  const bod = req.query;

  try {
    const bookmarks = await bookmarkSchema.getAllBookmarks(
      user_id,
      bod.sortBy || null
    );

    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/comment", async (req, res) => {
  const user_id = req.user._id;
  console.log("USER_ID:", user_id);

  const { comment, rating, product_id } = req.body;

  const newComment = await commentFormat.typeComment(
    user_id,
    comment,
    rating,
    product_id
  );

  console.log(newComment);
  res.status(200).json({ newComment });
});

router.get("/profile", async (req, res) => {
  const user_id = req.user._id;

  try {
    const profile = await User.findById(user_id);

    if (!profile) {
      throw new Error("User does not exist");
    }

    res
      .status(200)
      .json({ message: "Profile successfully fetch", profile: profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/updateUsername", async (req, res) => {
  const user_id = req.user._id;
  const { username } = req.body;

  try {
    const user = await User.findById(user_id);
    if (!user) {
      throw new Error("User not found");
    }

    user.username = username;
    user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/updatePhone", async (req, res) => {
  const user_id = req.user._id;
  const { phone } = req.body;

  try {
    const user = await User.findById(user_id);
    if (!user) {
      throw new Error("User not found");
    }

    user.phoneNumber = phone;
    user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/updateAddress", async (req, res) => {
  const user_id = req.user._id;
  const { address } = req.body;

  try {
    const user = await User.findById(user_id);
    if (!user) {
      throw new Error("User not found");
    }

    user.address = address;
    user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/updateEmail", async (req, res) => {
  const user_id = req.user._id;
  const { email } = req.body;

  try {
    const user = await User.findById(user_id);
    if (!user) {
      throw new Error("User not found");
    }

    user.email = email;
    user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/updatePassword", async (req, res) => {
  const user_id = req.user._id;
  const { currentPassword, newPassword } = req.body;

  try {
    const updatedUser = await User.changePassword(
      user_id,
      currentPassword,
      newPassword
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/bookmarks", async (req, res) => {
  const user_id = req.user._id;
  const { productId } = req.query;

  try {
    const newBookmarks = await bookmarkSchema.removeBookmark(
      user_id,
      productId
    );

    res.status(200).json(newBookmarks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
