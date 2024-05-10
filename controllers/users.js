const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  INVALID_DATA,
  SERVER_ERROR,
  REQUEST_SUCCESSFUL,
  UNAUTHORIZED,
  NOT_FOUND,
  REQUEST_CONFLICT,
  REQUEST_CREATED,
  // REQUEST_CREATED,
} = require("../utils/errors");

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(INVALID_DATA)
      .send({ message: "Email and password are required" });
  }

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res
          .status(INVALID_DATA)
          .send({ message: "Invalid email or password" });
      }

      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return res
            .status(UNAUTHORIZED)
            .send({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.status(REQUEST_SUCCESSFUL).send({
          message: "Authentication successful",
          user: { name: user.name, email: user.email },
          token,
        });
      });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: "User not found" });
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(REQUEST_SUCCESSFUL).send({
        message: "User found",
        user: { name: user.name, email: user.email, token },
      });
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError" || err.name === "CastError") {
        res.status(NOT_FOUND).send({ message: "User not found" });
      }

      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const updateUserProfile = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, avatar }, { new: true })

    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(REQUEST_SUCCESSFUL).send(user);
    })
    .catch((err) => {
      console.error(err);
      // if (err.name === "DocumentNotFoundError") {
      //   return res.status(NOT_FOUND).SEND({ message: "User not found" });
      // }

      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA).send({ message: "Invalid data " });
      }

      // if (err.name === "CastError") {
      //   return res.status(INVALID_DATA).send({ message: "Invalid data" });
      // }

      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // User.findOne({ email: email });
  // then((existingUser) => {
  //   if (existingUser) {
  //     res.status(REQUEST_CONFLICT).send({ message: "Eamil already exists" });
  //   }

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({
        name,
        avatar,
        email,
        password: hashedPassword,
      }),
    )

    .then((user) => {
      return res.status(REQUEST_CREATED).send({
        message: "User created",
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      });
    })

    .catch((err) => {
      console.error(err);

      if (err.code === 11000) {
        return res
          .status(REQUEST_CONFLICT)
          .send({ message: "Email already exists" });
      }

      if (err.code === email) {
        res.status(INVALID_DATA).send({ message: "Invalid email format" });
      }

      if (err.name === "ValidationError") {
        return res
          .status(INVALID_DATA)
          .send({ message: "Invalid data provided" });
      }

      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
};
