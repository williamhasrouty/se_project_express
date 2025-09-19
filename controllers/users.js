const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_INTERNAL_SERVER,
  ERROR_CODE_CREATED,
  ERROR_CODE_OK,
  ERROR_CODE_CONFLICT,
  ERROR_CODE_UNAUTHORIZED,
} = require("../utils/errors");

// POST /users
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(ERROR_CODE_CREATED).send(userObj);
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res
          .status(ERROR_CODE_CONFLICT)
          .send({ message: "Email already exists." });
      }
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODE_BAD_REQUEST)
          .send({ message: "Invalid data." });
      }
      return res
        .status(ERROR_CODE_INTERNAL_SERVER)
        .send({ message: "An error has occurred on the server." });
    });
};

// GET /users/:userId
const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(ERROR_CODE_OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: "User not found." });
      } else if (err.name === "CastError") {
        return res
          .status(ERROR_CODE_BAD_REQUEST)
          .send({ message: "Invalid data." });
      }
      return res
        .status(ERROR_CODE_INTERNAL_SERVER)
        .send({ message: "An error has occurred on the server." });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERROR_CODE_BAD_REQUEST)
      .send({ message: "Email and password are required." });
  }
  
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_CODE_UNAUTHORIZED)
        .send({ message: "Incorrect email or password." });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: "User not found." });
      }
      return res.status(ERROR_CODE_OK).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODE_BAD_REQUEST)
          .send({ message: "Invalid data." });
      }
      return res
        .status(ERROR_CODE_INTERNAL_SERVER)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateProfile,
};
