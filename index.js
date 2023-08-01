const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");  //DB
const URI =
  "mongodb+srv://muhlan:11102541@cluster0.4wmslcm.mongodb.net/test?retryWrites=true&w=majority"; //DB
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const connectDB = async () => { //DB
  try {
    await mongoose.connect(URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("DB connected");
  } catch (error) {
    console.log("====>",error);
  }
};

connectDB();

const userSchema = new mongoose.Schema({
    username : String,
    password : String
})

const User = new mongoose.model("User",userSchema)

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/register.html");
});

app.post("/register", function (req, res) {
    console.log(req.body.username)
    console.log(req.body.password)
  const newUser = new User({
    username : req.body.username,
    password: req.body.password
  })

  try {
    newUser.save()      //save collect tion (function MongoDB)
    res.send("Registerred")
  } catch (error) {
    console.log(error)
  }

//   try {

//     newUser.save(function(err){  // mongoDB function
//         if(err){
//             console.log(err)
//         }else{
//             res.send("Register")
//         }
//       })
    
//   } catch (error) {
//     console.log("=====>",error)
//   }


});
app.listen(3000 || process.env.Port, function () {
  console.log("server is on 3000");
});
