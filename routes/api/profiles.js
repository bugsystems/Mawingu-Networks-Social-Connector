const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Loading validation

const validateProfileInput = require("../../validation/profile");

//Get the Profile Model

const Profile = require("../../models/Profile");

//Get users
const User = require("../../models/User");

router.get(
  "/test",
  passport.authenticate("jwt", { session: false }, (req, res) => {
    const message = "Profile works";
    console.log(message);
  })
);
//getting the current user logged in the platform
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for the user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

//creating profile
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.location) profileFields.location = req.body.location;
    if (typeof req.body.skills != "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    if (req.body.bio) profileFields.bio = req.body.bio;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        Profile.findOneAndUpdate(
          { user: userId },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //Create profile
        //check if handle exist
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "The handle already exists";
            res.status(400).json(errors);
          }
          new Profile(profileFields).save().then(profile => {
            res.json(profile);
          });
        });
      }
    });
  }
);

//Get all active profiles profiles

router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.find()
      .populate("user", ["name", "avatar"])
      .then(profiles => {
        if (profiles) {
          res.status(200).json(profiles);
        } else {
          errors.allProfiles = "There are no profile created currently";
          return res.status(404).json(errors);
        }
      });
  }
);

// Get profile by handle

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "No profile for that user";
        return res.status(404).json(errors);
      }
      return res.status(200).json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// Get profile by user ID

router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "No profile for that user";
        return res.status(404).json(errors);
      }
      return res.status(200).json(profile);
    })
    .catch(err =>
      res.status(404).json({
        profile:
          "There is no profile for the user with ID: " + req.params.user_id
      })
    );
});

module.exports = router;
