const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
const { Parser } = require("json2csv");
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
// router.get("/register", (req, res) => {
//   res.render("auth/register", { title: "Register page" });
// });
var key;
const generateUniqueKey = () => {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  var id = "_" + Math.random().toString(36).substr(2, 9);
  debugger;
  // var key = "getSetgo-7568835897";
  Users.findOne({ key: id }).then((exists) => {
    if (exists) {
      generateUniqueKey();
    } else {
      key = id;
    }
  });
};

const sendMailToAdmin = (data) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "contact.aispiders@gmail.com",
      pass: "querty@123",
    },
  });

  var mailOptions = {
    from: "contact.aispiders@gmail.com",
    to: "contact.aispiders@gmail.com",
    subject: "Data of registered students",
    text: "data of last 10 students  :-" + data,
    attachments: [
      {   // utf-8 string as an attachment
          filename: 'users.csv',
          path: 'data/users.csv'
      }
    ]
    // html:
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const saveAsLocalCopy = (data) => {
  const fields = [
    "role",
    "id",
    "name",
    "email",
    "contact",
    "education",
    "college",
    "year of completion",
    "key",
    "date",
  ];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data);

  console.log(csv);

  var fs = require("fs");

  if (fs.existsSync("data/users.csv")) {
    fs.appendFile("data/users.csv", csv, function (err) {
      if (err) throw err;
      console.log("Appended to users csv!");
    });
  } else {
    fs.writeFile("data/users.csv", csv, function (err) {
      if (err) throw err;
      console.log("Saved to users csv!");
    });
  }
};

const checkDBCapacity = () => {
  Users.find({role:"User"})
    .then((users) => {
      // if (users.length >= 10) {
      sendMailToAdmin(users);
      saveAsLocalCopy(users);
      // }
    })
    .catch((err) => {});
};

//post request
router.post("/register", (req, res) => {
  key = generateUniqueKey();

  const errors = [];
  // if (req.body.password != req.body.confirmpassword) {
  //   errors.push({ text: "Password is not match" });
  // }
  // if (req.body.password.length < 4) {
  //   errors.push({
  //     text: "Password must be atleast 4 characters",
  //   });
  // }
  debugger;
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
    checkDBCapacity();
    Users.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          res.redirect("/emailExists");
          // res.status(501).send("Email already exits...📧")
          // req.flash("error_msg", "Email is already exits...📧");
          // res.redirect("/auth/register");
          // res.render('/', { "error_msg", "Email is already exits...📧"});
        } else {
          if (key) {
            const newUser = new Users({
              name: req.body.name,
              email: req.body.email,
              phonenumber: req.body.phonenumber,
              education: req.body.education,
              college: req.body.college,
              message: req.body.message,
              yearOfCompletion: req.body.yearOfCompletion,
              // password: req.body.password,
              key: key,
            });

            // bcrypt.genSalt(10, (err, salt) => {
            //   bcrypt.hash(newUser.password, salt, (err, hash) => {
            //     if (err) throw err;
            //     newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                var transporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                    user: "contact.aispiders@gmail.com",
                    pass: "querty@123",
                  },
                });

                var mailOptions = {
                  from: "aispider@gmail.com",
                  to: user.email,
                  subject: "Congratulations on registering with aispiders",
                  text:
                    "Hi " +
                    user.name +
                    ", thankyou for registering with getSetgo launched by aispiders and please save this authenticated id with you it will be helpfull later :- " +
                    user.key,
                };

                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("Email sent: " + info.response);
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
                // res.redirect("/");
                // checkDBCapacity();

                res.redirect("/success");
              })
              .catch((err) => console.log(err));
            //   });
            // });
          }
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
