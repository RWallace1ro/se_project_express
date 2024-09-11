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

router.delete("/:itemId", validateId, deleteItem);
router.put("/:itemId/likes", validateId, likeItem);
router.delete("/:itemId/likes", validateId, dislikeItem);

router.post("/", validateCardBody, createItem);

module.exports = router;
