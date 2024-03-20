const router = require("express").Router();

const userRouter = require("./users");

router.use("/users", userRouter);

const clothingItemsRouter = require("./clothingItems");

router.use("/items", clothingItemsRouter);

module.exports = router;
