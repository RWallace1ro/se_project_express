const router = require("express").Router();

const { login, createUser } = require("../controllers/users");
const authorizationMiddleware = require("../middleware/auth");
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/users", authorizationMiddleware, userRouter);
router.use("/items", authorizationMiddleware, clothingItemsRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Route not found" });
});

module.exports = router;
