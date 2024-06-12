const router = require("express").Router();
const {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
} = require("../controllers/users");

const auth = require("../middleware/auth");

router.post("/signin", login);
router.post("/signup", createUser);

router.get("/:me", auth, getCurrentUser);
router.patch("/:me", auth, updateUserProfile);

module.exports = router;
