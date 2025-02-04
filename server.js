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

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://gaphubsolutions.netlify.app",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin); // Dynamically allow the requesting origin
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allows cookies, authentication headers, etc.
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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
