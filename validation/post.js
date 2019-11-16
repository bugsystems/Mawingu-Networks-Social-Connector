const Validator = require("validator");

const isEmpty = require("./isEmpty");

module.exports = function validatePostInputs(data) {
  data.content = !isEmpty(data.content) ? data.content : "";
  data.title = !isEmpty(data.title) ? data.title : "";

  const errors = {};

  if (Validator.isEmpty(data.content)) {
    errors.content = "Content field is required";
  }
  if (Validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
