require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const Routess = require("./Routess");
const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to mongoDB");

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(Routess);
    //setUpRoutes(app);
    console.log("app routes is set up lets listen to the port ");
    app.listen(process.env.PORT || 4000);
  } catch (error) {
    console.error(error);
  }
};

start();
