const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const users = require("./routes/api/users");
const profile = require("./routes/api/profiles");
const posts = require("./routes/api/posts");
const passport = require("passport");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config

const db = require("./config/config").mongoURI;

//create connection to mongodb

mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//passport use

app.use(passport.initialize());

require("./config/passport")(passport);

app.get("/", (req, res) => res.send("Hello Node by me to you"));
app.use("/api/users", users);
app.use("/api/profiles", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server runing on port ${port}`));
