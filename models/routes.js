
const userModel = require("./user")
const bodyParser = require("body-parser")
const hashPassword = require("../helper.js")
const jwt = require("jsonwebtoken")


function setUpRoutes(app) {
  var urlencodedParser = bodyParser.urlencoded({ extended: false })

  app.get("/test", (req,res) => {
    res.send("hello ")
  })
  app.get("/homepage", urlencodedParser,async (req, res) => {
    try {
     

        const decodedToken = jwt.decode(token);

        const user = await userModel.findById(decodedToken.sub);
        if (!user) {
          res.send("you dont have permisson");
        }
        jwt.verify(token, user.salt);
      
    } catch (error) {
      res.status(401).send({ error: error });
    }
  });

 app.get("/profile", async(req,res) =>{
   await userModel.find({}, (err, data)=>{
     res.json(data)
   })
 })
  

  app.post("/register", urlencodedParser, async (req, res) => {
    
    const { username, email, password } = req.body
    
    try {
      const newUser = new userModel({
        username,
        email,
        password,
      })

      await newUser.save()

      res.send(newUser)
    } catch (error) {
      res.statusCode = 400
      res.send(error.message)
    }
  })
  app.post("/login",  urlencodedParser, async (req, res) => {
    try {
     
      const { email, password } = req.body.body;
    console.log(req.body, "req.body")
    const userAcc = await userModel.findOne({email})
    
    if (!userAcc) {
      // res.statusCode(404);
      console.log("user does not exist ")
      res.send("user not found")
    } else {
      if (userAcc.password === hashPassword(password, userAcc.salt)) {
        const token = jwt.sign({ sub: userAcc._id }, "" + userAcc.salt, {
          expiresIn: 30,
        })
         res.send(token)
         console.log("successfully logged in ")
         const url = req.url
         if(url === '/login' && req.method === 'POST'){
         
          //redirect
          res.statusCode=302;
          res.setHeader('homepage','/');
          return res.end();
       }
         
      } else {
        // res.statusCode = 403;
        console.log("password is wrong ")
        res.send("password is wrong")
      }
    }
    } catch (error) {
      console.log(error)
    }
    
    

  })
   
}

module.exports = setUpRoutes 


//////////////////////////////
////code i might use//////////
//////////////////////////////
// const bodySchema = Joi.object({
    //   email: Joi.string().email().required(),
    //   username: Joi.string().required(),
    //   password: Joi.string().min(6).required(),
    // })