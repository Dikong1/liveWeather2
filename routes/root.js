const express = require('express');
const mongoose = require('mongoose');
const { mongoUrl } = require('../config/api');
const users = require('../models/login-model');
let router = express.Router();

mongoose.connect(mongoUrl, {}).then(()=>{
    console.log("MongoDB success");
}).catch((e)=>{
    console.log(e);
});

router
.get((req, res) => {
    res.render('login');
})

router
.route('/login')
.get((req, res) => {
    res.render('login');
})
.post(async (req, res) => {

    try {
        const check = await users.findOne({name: req.body.username});
        if(!check) {
            res.send("Username not found");
        }

        if(req.body.username === "admin" & req.body.password === check.password) {
            res.redirect("admin");
        }

        if(req.body.password === check.password) {
            res.redirect("home");
        }
    } catch (error) {
        res.send("wrong Details");
    }

});

router
.route('/signup')
.get((req, res) => {
    res.render("signup");
})
.post(async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    };

    const existingUser = await users.findOne({name: data.name});
    if(existingUser) {
        res.send("User already exists");
    } else {
        const userData = users.insertMany(data);
        res.render("login");
        console.log(userData);
    }

});

router
.route('/home')
.get((req, res) => {
    res.render("home");
})
.post(async (req, res) => {

    res.write("Welocome home");

});

module.exports = router;