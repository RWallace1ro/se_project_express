const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  REQUEST_SUCCESSFUL,
  NOT_FOUND,
  REQUEST_CREATED,
} = require("../errors/errors");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../routes");

const login = (req, res, next) => {
  console.log("trying to login");
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Password is undefined");
    throw new BadRequestError("Email and password are required");
  }

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        console.log("did not find that user");

        throw new UnauthorizedError("Invalid email or password");
      }

      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          console.log("User is not a match");
          throw new UnauthorizedError("Invalid email or password");
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
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        console.log("User not found:", userId);
        throw new NotFoundError("User not found");
      }

      console.log("User found:", user);

      return res.status(REQUEST_SUCCESSFUL).send({ data: user });
    })

    .catch((err) => {
      console.error("Error finding user:", err);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const updateUserProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, email, avatar } = req.body;

  return User.findByIdAndUpdate(
    userId,
    { name, email, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }

      console.log("Updated user:", user);

      return res.status(REQUEST_SUCCESSFUL).send({ data: user });
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !email || !password || !avatar) {
    throw new BadRequestError("Invalid data provided");
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
        // const errorMessages = Object.values(err.errors).map((e) => e.message);
        // return res.status(INVALID_DATA).send({
        next(new BadRequestError("Invalid data provided"));
      } else if (err.code === 11000) {
        next(new ConflictError("Email already exists"));
      } else {
        next(err);
      }

      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
};
