const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");  //DB
const ejs = require("ejs")

const URI =
  "mongodb+srv://muhlan:11102541@cluster0.4wmslcm.mongodb.net/test?retryWrites=true&w=majority"; //DB collection name : test
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));  //อ่านข้อมูลที่ส่งแบบ POST 
app.use(express.static("public"));
app.set('view engine', 'ejs') //ช่วยเรื่อง route


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
  //res.sendFile(__dirname + "/views/register.html");
  res.render("register") //ใช้ ejs ก็ไม่ต้องใช้คำสั่ง sendFile
});

app.get("/login",function(req, res){
  //res.sendFile(__dirname+"/views/login.html")
  res.render("login")
})

app.get("/index",function(req, res){
  //res.sendFile(__dirname+"/views/index.html")
  res.render("index",{username:currUsername, password:currPassword})
})

var currUsername = ""
var currPassword = ""

app.post("/login",async function(req,res){
  const username = req.body.username
  const password = req.body.password
  currUsername = username
  currPassword = password
  const ressonse = await User.findOne({ username:username})
  const ressonse2 = await User.find()
  //let temp = await User.db
  //console.log(ressonse,"+++++++")
  if(ressonse){
    if(ressonse.username == username && ressonse.password == password  ){
      //res.send("ยินดีต้อนรับเข้าสู่ระบบ")
      //res.sendFile(__dirname+"/views/index.html")
      res.redirect("/index")
    }else{
      res.send("รหัสหรือชื่อผู้ใช้ไม่ถูกต้อง")
    }
    
  }else{
    res.send("ไม่พบ user หรือ password")
    //res.redirect("/register.html")
  }
  
  //console.log(temp.collections,"--------")
  //console.log(ressonse2)

  let tempCollection =[]
  for(const key in ressonse2){
    //console.log(ressonse2[key])
    tempCollection.push(ressonse2[key])
  }
  console.log(tempCollection.length)
  // const ressonse = await User.findOne({ username:username }, 'name length').exec();
  // console.log(ressonse,"========")
  // if(ressonse){
  //   console.log(ressonse._id)
  // }
  //User.findOne({username:username})
  // User.findOne({username:username},function(err,foundUser){
  //   if(err){
  //     console.log(err)
  //   }else{
  //     if(foundUser){
  //       if(foundUser.password === password){
  //         res.send("logged in")
  //       }else{
  //         res.send("Password is incorrect!")
  //       }
  //     }else{
  //       res.send("No user with this username exist")
  //       //res.redirect("/register")
  //     }
  //   }
  // })



})

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
