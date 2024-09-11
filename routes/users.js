const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { getCurrentUser, updateUserProfile } = require("../controllers/users");
const auth = require("../middleware/auth");

const validateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": "The name must be at least 2 characters long",
      "string.max": "The name must be less than or equal to 30 characters long",
      "string.empty": "The name field must be filled in",
    }),
    avatar: Joi.string().uri().optional().messages({
      "string.uri": "The avatar must be a valid URL",
    }),
  }),
});

router.get("/:me", auth, getCurrentUser);
router.patch("/:me", auth, validateUserProfile, updateUserProfile);

module.exports = router;
