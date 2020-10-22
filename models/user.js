const {Schema , model} = require("mongoose")
const shortId = require("shortid")
const hashPassword = require("../helper")
const userSchema = new Schema({
    username: String ,
    email:{type:String, unique:true },
    password: String ,
    salt: String
})
userSchema.pre("save", async function () {
    this.salt = shortId.generate();
    this.password = await hashPassword(this.password, this.salt);
    console.log(this.password);
  });
const userModel = new model("users", userSchema);
module.exports = userModel