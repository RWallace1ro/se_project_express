const router = require("express").Router();
const { validateCardBody, validateId } = require("../middlewares/validation");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const authorizationMiddleware = require("../middleware/auth");

router.get("/", getItems);

router.use(authorizationMiddleware);

router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

router.post("/", validateCardBody, createItem);
router.delete("/:id", validateId, deleteItem);

module.exports = router;
