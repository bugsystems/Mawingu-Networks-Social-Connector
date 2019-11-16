const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");

// Load mongoose and passport

const mongoose = require("mongoose");
const passport = require("passport");

// /Load users
const User = require("../../models/User");
//Loaad avatar

const gravatar = require("gravatar");
//Load validation
const validatePostInput = require("../../validation/post");

router.get("/test", (req, res) => res.json({ message: "Posts works" }));

// Get all posts
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    const userId = 1212;
    Post.find()
      .then(posts => {
        if (!posts) {
          errors.posts = "There are no posts for now.";
          res.status(404).json(errors);
        }
        return res.status(200).json(posts);
      })
      .catch(err => console.log(err));
  }
);

// Create post for a user
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const avatar = gravatar.url(req.body.email, {
      s: "200", //size
      r: "pg", //rating
      d: "mm" //default
    });
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      user: req.user.id,
      name: req.user.name,
      avatar: avatar
    });
    console.log(newPost);
    newPost
      .save()
      .then(post => res.json(post))
      .catch(err => console.log(err));
  }
);
//Find posts for a user by User ID

router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Post.find({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(post => {
      if (!post) {
        errors.noposts = "No posts for that user";
        return res.status(404).json(errors);
      }
      return res.status(200).json(post);
    })
    .catch(err =>
      res.status(404).json({
        posts: "There are no posts for the user with ID: " + req.params.user_id
      })
    );
});

module.exports = router;
