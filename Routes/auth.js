const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
const { Parser } = require("json2csv");
var fs = require("fs");

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

const sendMailToAdmin = (call) => {
  debugger;
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
    text: "data of last 10 students attached below :-",
    attachments: [
      {
        // utf-8 string as an attachment
        filename: "users.csv",
        path: "data/users.csv",
      },
    ],
    // html:
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent to admin with file");
      call();
      // return true;
    }
  });
};

const fields = [
  "role",
  "id",
  "name",
  "email",
  "phonenumber",
  "education",
  "college",
  "yearOfCompletion",
  "key",
  "date",
];
const json2csvParser = new Parser({ fields });

const saveAsLocalCopy = (data, call) => {
  debugger;
  const csv = json2csvParser.parse(data);

  console.log(csv);
  fs.appendFile("data/users.csv", csv, function (err) {
    if (err) throw err;
    debugger;
    console.log("Saved to users csv!");
    sendMailToAdmin(call);
  });

  // data = JSON.stringify(data)
  // if (fs.existsSync("data/users.json")) {
  //   fs.appendFileSync("data/users.json", data, function (err) {
  //     if (err) throw err;
  //     console.log("Appended to users json!");
  //     sendMailToAdmin(call) ;

  //     // return true;
  //   });
  // } else {
  //   fs.writeFileSync("data/users.json", data, function (err) {
  //     if (err) throw err;
  //     debugger
  //     console.log("Saved to users json!");
  //     sendMailToAdmin(call) ;

  //     // return true;
  //   });
  // }
};
const connectoMongo = () => {
  //connection mongodb
  const mongodbUrl =
    // "mongodb+srv://jspiders:shashi123@cluster0-trwtz.mongodb.net/test?retryWrites=true&w=majority";
    "mongodb+srv://aispider:querty@123@getsetgodb-yn6hf.mongodb.net/Registration?retryWrites=true&w=majority";
  mongoose.connect(
    mongodbUrl,
    {
      // autoReconnect: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    },
    (err) => {
      if (err) throw err;
      console.log("database connected");
    }
  );
};

setInterval(() => {
  checkDBCapacity()
}, 21600000);

const checkDBCapacity = () => {
  debugger;
  Users.find({ role: "User" })
    .then((users) => {
      // if (users.length >= 5000) {
        saveAsLocalCopy(users, function () {
          Users.remove({ role: "User" })
            .then((success) => {
              console.log("database cleared");
              connectoMongo();
              // res.redirect("/success");
            })
            .catch((err) => {
              console.log("database not cleared");
            });
        });
      // }
       //else {
      //   res.redirect("/success");
      // }
    })
    .catch((err) => {});
};

//post request
router.post("/register", (req, res) => {
  key = generateUniqueKey();

    Users.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          res.redirect("/emailExists");
        } else
        {
          if (key) {
            const newUser = new Users({
              name: req.body.name,
              email: req.body.email,
              phonenumber: req.body.phonenumber,
              education: req.body.education,
              college: req.body.college,
              yearOfCompletion: req.body.yearOfCompletion,
              city:req.body.city,
              state:req.body.state,
              usn:req.body.usn,
              key: key,
            });

            newUser
              .save()
              .then((user) => {
                console.log("came");

                // Users.count({role:"User"}, function (err, count) {
                //   console.log("Number of docs: ", count);
                //   if (count >= 500) {
                //     checkDBCapacity(res);
                //   } else {
                    // res.redirect("/success");
                //   }
                // });

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
                    console.log("Email sent to User with key");
                  }
                });

                res.redirect("/success");
              })
              .catch((err) => console.log(err));
          }
        }
      })
      .catch((err) => console.log(err));
  
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
