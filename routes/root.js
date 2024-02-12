const express = require('express');
const https = require('https');
const mongoose = require('mongoose');
const { mongoUrl } = require('../config/api');
const users = require('../models/login-model');
const currencies = require('../models/currency-model');
let router = express.Router();

mongoose.connect(mongoUrl, {}).then(()=>{
    console.log("MongoDB success")
}).catch((e)=>{
    console.log(e);
});

let loginState = {
    isLogged: false,
    loginName: "",
    isAdmin: false
}

router
.route('')
.get((req, res) => {
    res.redirect('login');
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
            return;
        }

        if(req.body.username === "Dias" & req.body.password === check.password) {
            loginState = {
                isLogged: true,
                loginName: req.body.username,
                isAdmin: true
            }
            res.redirect("admin");
            return;
        }

        if(req.body.password === check.password) {
            loginState = {
                isLogged: true,
                loginName: req.body.username,
                isAdmin: false
            }
            res.redirect("home");
        } else {
            res.send("Password incorrect!")
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
        password: req.body.password,
        isAdmin: false
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

router
.route('/profile')
.get((req, res) => {
    res.render("profile", loginState)
})

router
.route('/quit')
.post((req, res) => {
    loginState = {
        isLogged: false,
        loginName: "",
        isAdmin: false
    }
    res.redirect("profile")
})

router
.route('/admin')
.get((req, res) => {
    if (loginState.isAdmin) {
        res.render("admin")
    } else {
        res.send("You don`t have admin status, please login as admin")
    }
    
})

router
.route('/admin/deleteUser')
.post(async (req, res) => {
    const check = await users.findOne({name: req.body.delUsername})
    if (!check) {
        res.send("User not found");
        return;
    }
    try {
        await users.deleteOne({name: req.body.delUsername});
        res.send("User deleted");
        return;
    } catch (error) {
        console.log(error);
    }
    
    res.redirect('back');
});

router
.route('/admin/changePassw')
.post(async (req, res) => {
    const check = await users.findOne({name: req.body.modUsername})
    if (!check) {
        res.send("User not found");
        return;
    }
    try {
        await users.updateOne({ name: check.name}, {password: req.body.password});
        res.send("Password changed");
    } catch (error) {
        console.log("Error modifying");
    }
    
});

// ------------------------------------------- APIs---------------------------------
router
.route('/exchangeRate')
.post(function(req, res) {
    const openExchangeApi = 'cde30c9712e647aaba74f5926869446b';
    const exchangeRateUrl = `https://openexchangerates.org/api/latest.json?app_id=${openExchangeApi}`;

    https.get(exchangeRateUrl, function(apiRes) {
        let data = '';

        apiRes.on('data', function(chunk) {
            data += chunk;
        });

        apiRes.on('end', function() {
            const exchangeData = JSON.parse(data);
            
            const kztExchangeRate = exchangeData.rates.KZT;

            res.render('exchangeRate', { exchangeRate: kztExchangeRate });
        });
    });
});

module.exports = router;