const { celebrate, Joi } = require("celebrate");
const router = require("express").Router();
const BadRequestError = require("./BadRequestError");
const UnauthorizedError = require("./UnauthorizedError");
const ForbiddenError = require("./ForbiddenError");
const NotFoundError = require("./ForbiddenError");
const ConflictError = require("./ConflictError");

const { login, createUser } = require("../controllers/users");
const authorizationMiddleware = require("../middleware/auth");
const userRouter = require("../routes/users");
const clothingItemsRouter = require("../routes/clothingItems");
// const { NOT_FOUND } = require("./errors");
// const ConflictError = require("./ConflictError");

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": "The email must be a valid email address",
      "string.empty": "The email field must be filled in",
    }),
    password: Joi.string().required().messages({
      "string.empty": "The password field must be filled in",
    }),
  }),
});

router.post("/signin", validateSignin, login);

const validateSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": "The name must be at least 2 characters long",
      "string.max": "The name must be less than or equal to 30 characters long",
      "string.empty": "The name field must be filled in",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "The email must be a valid email address",
      "string.empty": "The email field must be filled in",
    }),
    password: Joi.string().required().messages({
      "string.empty": "The password field must be filled in",
    }),
    avatar: Joi.string().uri().optional().messages({
      "string.uri": "The avatar must be a valid URL",
    }),
  }),
});

router.post("/signup", validateSignup, createUser);

router.use("/users", authorizationMiddleware, userRouter);
router.use("/items", clothingItemsRouter);

router.use(() => {
  throw new NotFoundError("Route not found");
});

module.exports = router;
module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
