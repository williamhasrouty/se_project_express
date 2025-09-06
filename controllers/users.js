const User = require("../models/User");
const {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_INTERNAL_SERVER,
  ERROR_CODE_CREATED,
  ERROR_CODE_OK,
} = require("../utils/errors");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(ERROR_CODE_OK).send(users))
    .catch((err) => {
      console.log(err);
      return res.status(ERROR_CODE_INTERNAL_SERVER).send({ message: err.message });
    });
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(ERROR_CODE_CREATED).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: err.message });
      }
      return res.status(ERROR_CODE_INTERNAL_SERVER).send({ message: err.message });
    });
};

// GET /users/:userId
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(ERROR_CODE_OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: err.message });
      }
      return res.status(ERROR_CODE_INTERNAL_SERVER).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
};
