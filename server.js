require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const appRoutes = require("./router/routes");
const authorizedRoutes = require("./router/authorizedRoutes");
const userRoutes = require("./router/user");
const cookieParser = require("cookie-parser");

const app = express();

// middleware
app.use(express.json());

//cookie-parser
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    // methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    // allowedHeaders: ["Content-Type", "Authorization"],
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
app.use("/v1/api", authorizedRoutes);

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
