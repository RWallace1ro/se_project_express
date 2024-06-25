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
  REQUEST_CREATED,
  REQUEST_CONFLICT,
} = require("../utils/errors");

const login = (req, res) => {
  console.log("trying to login");
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Password is undefined");
    return res
      .status(INVALID_DATA)
      .send({ message: "Email and password are required" });
  }

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        console.log("did not find that user");
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Invalid email or password" });
      }

      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          console.log("User is not a match");
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
  const userId = req.user._id;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        console.log("User not found:", userId);
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }

      console.log("User found:", user);

      return res.status(REQUEST_SUCCESSFUL).send({ data: user });
    })

    .catch((err) => {
      console.error("Error finding user:", err);

      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }

      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: "Invalid data" });
      }

      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const updateUserProfile = (req, res) => {
  const userId = req.user._id;
  const { name, email, avatar } = req.body;

  return User.findByIdAndUpdate(
    userId,
    { name, email, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }

      console.log("Updated user:", user);

      return res.status(REQUEST_SUCCESSFUL).send({ data: user });
    })
    .catch((err) => {
      console.error(err);

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

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !email || !password || !avatar) {
    return res.status(INVALID_DATA).send({ message: "Invalid data provided" });
  }

  return bcrypt
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
      const userObject = user.toObject();
      delete userObject.password;
      res.status(REQUEST_CREATED).send({ userObject });
    })

    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        const errorMessages = Object.values(err.errors).map((e) => e.message);
        return res.status(INVALID_DATA).send({
          message: "Invalid data provided",
          errors: errorMessages,
        });
      }

      if (err.code === 11000) {
        return res
          .status(REQUEST_CONFLICT)
          .send({ message: "Email already exists" });
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
