const Validator = require("validator");

const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInputs(data) {
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  const errors = {};
  if (!Validator.isLength(data.name, { min: 2, max: 15 })) {
    errors.name = "Name must have characters between 2 and 15";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 15 })) {
    errors.password =
      "Password should have at least 6 characters and maximum of 15 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
