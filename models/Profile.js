const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  handle: {
    type: String,
    required: true,
    max: 30
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
