const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
// const auth = require("../middleware/auth");

const {
  INVALID_DATA,
  SERVER_ERROR,
  REQUEST_SUCCESSFUL,
  UNAUTHORIZED,
  NOT_FOUND,
  // REQUEST_CREATED,
  REQUEST_CONFLICT,
} = require("../utils/errors");

const login = (req, res) => {
  const { email, password } = req.body;
  // User.findUserByCredentials({ email, password });
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Invalid email or password" });
      }

      // bcrypt.hash(password);
      bcrypt
        .compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.error(err);
            return res
              .status(SERVER_ERROR)
              .send({ message: "An error has occurred on the server" });
          }

          if (!isMatch) {
            return res
              .status(UNAUTHORIZED)
              .send({ message: "Invalid email or password" });
          }

          const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: "7d",
          });
          res
            .status(REQUEST_SUCCESSFUL)
            .send({ user: { name: user.name, email: user.email }, token });
        })

        .catch((err) => {
          console.error(err);
          // res.status(UNAUTHORIZED).SEND({ message: "Invalid email or password" });
          return res
            .status(SERVER_ERROR)
            .send({ message: "An error has occurred on the server." });
        });
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.status(REQUEST_SUCCESSFUL).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res
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

// const getUsers = (_getUsers, res) => {
//   User.find({})
//     .then((users) => res.status(REQUEST_SUCCESSFUL).send({ users }))
//     .catch((err) => {
//       console.error(err);
//       return res
//         .status(SERVER_ERROR)
//         .send({ message: "An error has occurred on the server." });
//     });
// };

// const getUser = (req, res) => {
//   const { userId } = req.params;
//   User.findById(userId)
//     .orFail()
//     .then((user) => res.status(REQUEST_SUCCESSFUL).send(user))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(NOT_FOUND).send({ message: err.message });
//       }
//       if (err.name === "CastError") {
//         return res.status(INVALID_DATA).send({ message: "Invalid data" });
//       }
//       return res
//         .status(SERVER_ERROR)
//         .send({ message: "An error has occurred on the server." });
//     });
// };

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email: req.body.email,
        password: hash,
      }),
    )
    .then((user) => {
      res
        .status(REQUEST_CONFLICT)
        .send({ user: { message: "Email already exists" } });

      res.status(REQUEST_SUCCESSFUL).send({
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
          .status(INVALID_DATA)
          .send({ message: "Email already exists" });
      }

      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA).send({ message: "Invalid data" });
      }

      // .catch((err) => {
      //   console.error("Error hashing password:", err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// const createUser = (req, res) => {
//   const { name, avatar, email, password } = req.body;
//   User.create({ name, avatar, email, password })
//     .then((user) => res.status(REQUEST_SUCCESSFUL).send({ user }))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "ValidationError") {
//         return res.status(INVALID_DATA).send({ message: "Invalid data" });
//       }
//       return res
//         .status(SERVER_ERROR)
//         .send({ message: "An error has occurred on the server." });
//     });
// };

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
};

// I do not see the project on GitHub
