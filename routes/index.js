const router = require("express").Router();

const userRouter = require("./users");

router.use("/users", userRouter);

const clothingItemsRouter = require("./clothingItems");

router.use("/items", clothingItemsRouter);

const { NOT_FOUND } = require("../utils/errors");

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Route not found" });
});

module.exports = router;
