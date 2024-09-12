const router = require("express").Router();
const { getCurrentUser, updateUserProfile } = require("../controllers/users");
const auth = require("../middleware/auth");
const { validateUserProfile } = require("../middlewares/validation");

router.get("/:me", auth, getCurrentUser);
router.patch("/:me", auth, validateUserProfile, updateUserProfile);

module.exports = router;
