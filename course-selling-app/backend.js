const express = require('express');
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { allowedNodeEnvironmentFlags } = require('process');
const { callbackify } = require('util');

const userSchema = new mongoose.Schema({
    username: {type: String},
    password: String,
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
  });
  
  const adminSchema = new mongoose.Schema({
    username: String,
    password: String
  });
  
  const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean
  });

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);


const secret = "secret";

app.use(express.json());

const adminAuthentication = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token,secret, (err, user) => {
            if(err){
                return res.sendStatus(403);
            }
            req.user = user;
            next(); 
        });
    }else{
        res.sendStatus(401);
    }
};

mongoose.connect('mongodb+srv://manishcodec:v6dBO0oAyl55rUPH@cluster0.7klz06r.mongodb.net/.net/courses', {dbName: "admins" });

app.post("/admin/signup", (req, res) =>{
    const {username, password}  = req.body;
    function callback(admin){
        if(admin){
            res.status(403).json({message:"Admin already exists"});
        }else{
            const obj = { username: username, password: password};
            const newAdmin = new Admin(obj);
            newAdmin.save();
            res.json({message: "Admin created successfully"});
        }
    }
    Admin.findOne({username}).then(callback);
})

app.post("/admin/login", async (req, res) => {
    const {username, password} = req.headers;
    const isExist = await Admin.findOne({username, password});
    if(isExist){
        const token = jwt.sign({username, role: "admin"}, secret);
        res.status(200).json({message: "Admin Login Successfull", token});
    }else{
        res.status(403).json({message: "Invalid username or password"});
    } 
})

app.post("/users/signup", (req, res)=> {
    const {username, password} = req.body;
    function callback(user){
        if(user){
            res.status(403).json("user already exist");
        }else{
            const obj = {username: username, password: password};
            const newUser = new User(obj);
            newUser.save();
            res.status(200).json({message: "User created successfully"});
        }
    }
        User.findOne({username}).then(callback);
})

app.post('/users/login',async (req, res) =>{
    const {username, password} = req.headers;
    const isExist = await User.findOne({username, password});
    if(isExist){
        const token = jwt.sign({username, role:"user"}, secret)
        res.status(200).json({message:"User login successful", token});
    }else{
        res.status(403).json({message:"Invalid username or password"})
    }
})

app.post("/admin/courses", adminAuthentication, async (req,res) => {
    const course = new Course(req.body);
    await course.save()
    res.json({message: "Course created successfully", courseId: course.id});
});

app.listen(port, () =>{
    console.log(`server started at port ${port}`);
});