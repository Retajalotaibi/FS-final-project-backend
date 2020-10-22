 const express = require("express");
  const mongoose = require("mongoose");
 const setUpRoutes = require("./models/routes");
 const cors = require("cors");
 
 


const start = async () => {

try {
  await mongoose.connect("mongodb://localhost/Final-project-barmej",{
  useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
})
console.log("Connected to mongoDB")

  const app = express();
  

app.use(cors())
app.use(express.json())

  setUpRoutes(app)
  console.log("app routes is set up lets listen to the port ")


app.listen(4000);
} catch (error) {
  console.error(error)
}

}

start()



