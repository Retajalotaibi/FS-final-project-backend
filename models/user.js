const { Schema, model } = require("mongoose");
const shortId = require("shortid");
const hashPassword = require("../helper");
const { string } = require("@hapi/joi");
const userSchema = new Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  number: String,
  city: String,
  salt: String,
  Courses: [
    { title: String, completed: Boolean },
    { title: String, completed: Boolean },
    { title: String, completed: Boolean },
    { title: String, completed: Boolean },
    { title: String, completed: Boolean },
    { title: String, completed: Boolean },
    { title: String, completed: Boolean },
    { title: String, completed: Boolean },
    { title: String, completed: Boolean },
  ],
});
userSchema.pre("save", async function (next) {
  const salt = "secret";
  this.salt = shortId.generate();
  this.password = await hashPassword(this.password, this.salt);
  console.log(this.password);
  next();
});

const userModel = new model("users", userSchema);
module.exports = userModel;
