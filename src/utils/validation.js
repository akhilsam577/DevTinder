const validator = require("validator");

const validateSignUpData = (req) => {
  console.log("req.body", req.body);
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email-ID is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditfields = [
    "firstName",
    "lastName",
    "photoUrl",
    "age",
    "gender",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.data).every((filed) =>
    allowedEditfields.includes(filed)
  );

  return isEditAllowed;
};
module.exports = { validateSignUpData, validateEditProfileData };
