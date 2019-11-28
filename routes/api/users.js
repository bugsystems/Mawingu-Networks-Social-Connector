const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//Loading validator

const validateRegisterInput = require("../../validation/register");
const validateLoginInputs = require("../../validation/login");
//load user model
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
// const app = express();

//@route GET  api/users/test
//@desc To test users route
router.get("/test", (req, res) =>
  res.json({ message: "Users works and good to go..." })
);

//registration
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  console.log(req.body.email);
  User.findOne({ email: req.body.email })
    .then(user => {
      // console.log(user);
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200", //size
          r: "pg", //rating
          d: "mm" //default
        });
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar: avatar
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => this.setState({ errors: err.response.data }));
          });
        });
      }
    })
    .catch(err => console.log(err));
});

//logn of users

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInputs(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  // get user

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User not registered" });
    } else {
      //check user password

      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          //user matched
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
          };

          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  password: user.password
                }
              });
            }
          );
          // res.json({ message: "Sucess" });
        } else {
          return res.status(400).json({ passwword: "Password incorrect" });
        }
      });
    }
  });
});
//Protected router

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
