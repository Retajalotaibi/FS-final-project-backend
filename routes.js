const userModel = require("./models/user");
const bodyParser = require("body-parser");
const hashPassword = require("./helper.js");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");

function setUpRoutes(app) {
  var urlencodedParser = bodyParser.urlencoded({ extended: false });
  const salt = "secret";

  app.get("/", async (req, res) => {
    try {
      const token = req.headers.authorization;
      await userModel.find(async () => {
        console.log(token, "tokrn");
        if (!token) {
          res.send("you dont have permission");
          return;
        }

        const decodedToken = jwt.decode(token);
        console.log(decodedToken);
        if (decodedToken.sub) {
          const user = await userModel.findById(decodedToken.sub);
          if (!user) {
            console.log("you dont have permisson");
          }
          // jwt.verify(token, salt);
          res.send(user);
        }
      });
    } catch (error) {
      console.log(error, "error");
      res.status(401).send({ error: error });
    }
  });

  app.post("/register", urlencodedParser, async (req, res) => {
    const { username, email, password, city, number } = req.body;
    const bodySchema = Joi.object({
      email: Joi.string().email().required(),
      username: Joi.string().required(),
      number: Joi.number().required(),
      city: Joi.string().required(),
      password: Joi.string().min(6).required(),
    });
    const validationResult = bodySchema.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      res.send(validationResult.error.details[0].message);
      return;
    }
    try {
      const newUser = new userModel({
        username,
        email,
        number,
        city,
        password,
      });

      await newUser.save();

      res.send(newUser);
    } catch (error) {
      res.statusCode = 400;
      res.send(error.message);
    }
  });
  app.post("/login", urlencodedParser, async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log(req.body, "req.body");
      const userAcc = await userModel.findOne({ email });

      if (!userAcc) {
        res.send("user not found");
      } else {
        if (userAcc.password === hashPassword(password, userAcc.salt)) {
          const token = jwt.sign({ sub: userAcc._id }, "" + userAcc.salt, {
            expiresIn: 30000000000000000000000,
          });

          res.send(token);
          console.log("successfully logged in ");
        } else {
          res.statusCode = 403;
          console.log("password is wrong ");
          res.send("password is wrong");
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = setUpRoutes;
