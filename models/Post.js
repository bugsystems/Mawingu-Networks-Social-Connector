const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  name: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: Date.now
  },
  avatar: {
    type: String
  }
});

module.exports = Post = mongoose.model("posts", PostSchema);
