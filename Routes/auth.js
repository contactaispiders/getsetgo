const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcrypt");
var nodemailer = require('nodemailer');

const mailjet = require("node-mailjet").connect(
  "6ad9d79033ce4f9de3d76e2b215975d9",
  "5980e787e08d7aee47d3e3d4c5d8ff76"
);
const router = express.Router();

require("../Model/User");
const Users = mongoose.model("users");

//routes
router.get("/login", (req, res) => {
  res.render("auth/login", { title: "login page" });
});
router.get("/register", (req, res) => {
  res.render("auth/register", { title: "Register page" });
});

//post request
router.post("/register", (req, res) => {
  const errors = [];
  // if (req.body.password != req.body.confirmpassword) {
  //   errors.push({ text: "Password is not match" });
  // }
  // if (req.body.password.length < 4) {
  //   errors.push({
  //     text: "Password must be atleast 4 characters",
  //   });
  // }

  if (errors.length > 0) {
    res.render("auth/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phonenumber: req.body.phonenumber,
      education: req.body.education,
      college: req.body.college,
      password: req.body.password,
      confirmpassword: req.body.confirmpassword,
    });
  } else {
    Users.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          req.flash("error_msg", "Email is already exits...📧");
          // res.redirect("/auth/register");
          // res.render('/', { "error_msg", "Email is already exits...📧"});
        } else {
          const newUser = new Users({
            name: req.body.name,
            email: req.body.email,
            phonenumber: req.body.phonenumber,
            education: req.body.education,
            college: req.body.college,
            password: req.body.password,
          });

          // bcrypt.genSalt(10, (err, salt) => {
          //   bcrypt.hash(newUser.password, salt, (err, hash) => {
          //     if (err) throw err;
          //     newUser.password = hash;
          newUser
            .save()
            .then((user) => {
           
              var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'contact.aispiders@gmail.com',
                  pass: 'querty@123'
                }
              });
              
              var mailOptions = {
                from: 'aispider@gmail.com',
                to: user.email,
                subject: 'Congratulations on registering with aispiders',
                text: "Hi"+user.name+"Thankyou for registering with aispiders and please save this authenticated id with you it will be helpfull later:- "+user._id
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

              // const request = mailjet
              //   .post("send", { version: "v3.1" })
              //   .request({
              //     Messages: [
              //       {
              //         From: {
              //           Email: "jainchirag172@gmail.com",
              //           Name: "chirag",
              //         },
              //         To: [
              //           {
              //             Email: "jainchirag172@gmail.com",
              //             Name: "chirag",
              //           },
              //         ],
              //         Subject: "Greetings from Mailjet.",
              //         TextPart: "My first Mailjet email",
              //         HTMLPart:
              //           "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
              //         CustomID: "AppGettingStartedTest",
              //       },
              //     ],
              //   });
              // request
              //   .then((result) => {
              //     console.log(result.body);
              //   })
              //   .catch((err) => {
              //     console.log(err);

              //     console.log(err.statusCode);
              //   });

              // res.send("successfully registered")
              // req.flash("success_msg", "successfully user registered");
              res.redirect("/");
            })
            .catch((err) => console.log(err));
          //   });
          // });
        }
      })
      .catch((err) => console.log(err));
  }
});

//login post request
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/posts/users",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "Successfully logout...");
  res.redirect("/auth/login");
});

module.exports = router;
