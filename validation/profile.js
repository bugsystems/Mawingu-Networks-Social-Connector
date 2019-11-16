const Validator = require("validator");

const isEmpty = require("./isEmpty");

module.exports = function validateProfileInput(data) {
  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  const errors = {};

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Handle field is required";
  }
  if (Validator.isEmpty(data.status)) {
    errors.status = "Status field is required";
  }
  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Skills field is required";
  }
  if (!Validator.isLength(data.handle, { min: 2, max: 30 })) {
    errors.handle =
      "Handle should have at least 6 characters and maximum of 15 characters";
  }
  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Not a valid url for a website";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
