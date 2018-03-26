// source : https://www.linkedin.com/pulse/securing-your-node-js-api-json-web-token-mohamed-aymen-ourabi
// npm install --save  express body-parser morgan jsonwebtoken
// Rahul Verma

const express = require("express"),
     bodyParser = require("body-parser"),
     morgan = require("morgan"),
    jwt = require("jsonwebtoken"),
    config = require("./configurations/config.js"),
    app = express();

//set  secret
app.set("Secret" , config.secret)

// use morgan to log requests to the console
app.use(morgan("dev"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.listen(3000,function(){
 console.log("listening on 3000")
})

app.get("/",function(req,res){
    res.send('Hello world  app is running on http://localhost:3000/');
})


// middleware for protected routes
//A Router() instance is a (subrouting) complete middleware and routing system;it is often referred to as a “mini-app”
const protectedRoutes = express.Router();
app.use("/api",protectedRoutes);

protectedRoutes.use(function(req,res,next){

  var token = req.headers["access-token"];
  if(token){
      // verifies secret and checks if the token is expired
    jwt.verify(token,app.get("Secret"),function(err,decode){
      if(err){
          return res.json({ message: 'invalid token' });
      } else {
          // if everything is good, save to request for use in other routes
          console.log("---decode--",decode)
          req.decoded = decode;
          next();
      }
    })
  }

  else {

      // if there is no token

      res.send({

          message: 'No token provided.'
      });

  }

})

// check for middleware by getting some data
protectedRoutes.get('/getProducts',function(req,res){
  var products = [
      {name :"XX", number:2},
      {name : "YY" , number :3}
  ];

  res.json(products)
})


app.post("/authenticate",function(req,res){
  if(req.body.username=="rahul"){
      if(req.body.password == "rahul123"){

        const payload = {
              check : true
            };

        var token = jwt.sign(payload,app.get("Secret"),{expiresIn: 1440})
          res.json({
              message :"Authenticated",
              token : token
          })

      }
      else {
        res.json({message:"wrong password"})
      }
  }
  else {
    res.json({message:"wrong username"})
  }

})