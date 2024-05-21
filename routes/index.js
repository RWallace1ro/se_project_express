const router = require("express").Router();

const {
  login,
  createUser,
  // getCurrentUser,
  // updateUserProfile,
} = require("../controllers/users");

router.post("/signin", login);

router.post("/signup", createUser);

// router.get("/userId", getCurrentUser);

// router.patch("userId", updateUserProfile);

const authorizationMiddleware = require("../middleware/auth");

const userRouter = require("./users");

router.use("/users", authorizationMiddleware, userRouter);

const clothingItemsRouter = require("./clothingItems");

router.use("/items", authorizationMiddleware, clothingItemsRouter);

const { NOT_FOUND } = require("../utils/errors");

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Route not found" });
});

module.exports = router;
