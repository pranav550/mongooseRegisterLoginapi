var express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/Users");
const cors = require("cors");
router.use(cors());

process.env.SECRET_KEY = "secret";

router.post("/register", (req, res) => {
  const today = new Date();
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.first_name,
    email: req.body.email,
    password: req.body.password,
    created: today
  };

  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash;

          User.create(userData)
            .then(() => res.json({ msg: "User Sucessfully Registered" }))
            .catch(err => res.json({ msg: "error:" + err }));
        });
      } else {
        res.json({ error: "User Already Exists" });
      }
    })
    .catch(err => {
      res.json({ msg: "error " + err });
    });
});

router.post("/login", (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (user) {
        if (bcrypt.compare(req.body.password, user.password)) {
          const payload = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
          };
          let token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 1440
          });
          res.json({ token: token });
        } else {
          res.json({ error: "User Does Not Exist" });
        }
      } else {
        res.json({ error: "User Does Not Exist" });
      }
    })
    .catch(err => {
      res.json({ error: +err });
    });
});

router.get("/profile", (req, res) => {
  var decoded = jwt.verify(
    req.headers["authorization"],
    process.env.SECRET_KEY
  );

  User.findOne({
    _id: decoded._id
  })
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.json({ err: "User Does Not Exist " });
      }
    })
    .catch(err => {
      res.json({ err: "Error " + err });
    });
});

module.exports = router;
