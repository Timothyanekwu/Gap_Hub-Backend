require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const appRoutes = require("./router/routes");
const userRoutes = require("./router/user");

const app = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use((req, res, next) => {
  console.log(`${req.path} :: ${req.method}`);
  next();
});

// routes
app.use("/app/api", appRoutes);
app.use("/user/api", userRoutes);

// connecting to the database
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `connected to db and app is listening on PORT ${process.env.PORT}...`
      );
    });
  })
  .then()
  .catch((err) => {
    console.log(err);
  });
