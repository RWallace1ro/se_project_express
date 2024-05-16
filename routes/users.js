const router = require("express").Router();
const {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
} = require("../controllers/users");

const auth = require("../middleware/auth");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUserProfile);

// router.get("/users/userId/", auth, getCurrentUser);
// router.patch("/users /userId", auth, updateUserProfile);

router.post("/signin", login);
router.post("/signup", createUser);

module.exports = router;
