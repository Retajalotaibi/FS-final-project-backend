const express = require("express");
const mongoose = require("mongoose");
const setUpRoutes = require("./models/routes");
const cors = require("cors");
//const cookieParser = require("cookie-parser");

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Aziz:Aziz1234@cluster0.ynpi5.mongodb.net/Final-project-barmej?authSource=admin&replicaSet=atlas-hh9b4k-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
    console.log("Connected to mongoDB");

    const app = express();

    app.use(cors());
    app.use(express.json());
    //app.use(cookieParser());

    setUpRoutes(app);
    console.log("app routes is set up lets listen to the port ");

    app.listen(4000);
  } catch (error) {
    console.error(error);
  }
};

start();
