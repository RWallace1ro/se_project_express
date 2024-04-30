const router = require("express").Router();
const {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
} = require("../controllers/users");

const auth = require("../middleware/auth");

router.get("/users/me", auth, getCurrentUser);
router.patch("/users/me", auth, updateUserProfile);

router.post("/signin", login);
router.post("/signup", createUser);

module.exports = router;
