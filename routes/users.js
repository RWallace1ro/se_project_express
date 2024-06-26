const router = require("express").Router();
const { getCurrentUser, updateUserProfile } = require("../controllers/users");

const auth = require("../middleware/auth");

router.get("/:me", auth, getCurrentUser);
router.patch("/:me", auth, updateUserProfile);

module.exports = router;
