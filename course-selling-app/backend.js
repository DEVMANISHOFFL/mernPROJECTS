const express = require('express');
const app = express();
const port = 3000;

const ADMINS = [];
const USERS = [];
const COURSES = [];

app.use(express.json());

app.post("/admin/signup", (req, res) =>{
    const admin = req.body;
    const isExist = ADMINS.find(a => a.username === admin.username);

    if(isExist){
        res.json({message: "Admin already exists"})
    }else{
        ADMINS.push(admin);
        res.status(200).json({message: "Admin created successfully"});
    }
})

app.post("/admin/login", (req, res) => {
    const admin = req.body;
    const isExist = ADMINS.find(a => a.username === admin.username && a.password === admin.password);
    if(isExist){
        res.status(200).json({message: "Admin Login Successfull"});
    }else{
        res.status(404).json("Forbidden");
    }
})

app.get("/admins", (req,res) => {
    res.status(200).json({admins: ADMINS});
})

app.post("/users/signup", (req, res) =>{
    const user = req.body;
    const existingUser = USERS.find(a => a.username === user.username);
    if(existingUser){
       res.json({message:"user already exists"});
    }else{
        user.id = Date.now();
        USERS.push(user);
        res.status(200).json({message: "user created successfully", id: user.id});
    }
})

app.post("/users/login", (req, res) => {
    const user = req.body;
    const isExist = USERS.find(a => a.username === user.username && a.password === user.password);
    if(isExist){
        res.status(200).json({message: "User Login Successful"});
    }else{
        res.status(404).json("Forbidden");
    }
})

app.get("/users", (req,res) => {
    const users = USERS.find(a => a.username)
    res.status(200).json({users: users});
})


app.listen(port, () =>{
    console.log(`server started at port ${port}`);
});