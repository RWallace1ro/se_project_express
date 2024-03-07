const router = require("express").Router();
const { getUsers } = require("../controllers/users");

router.get("/", getUsers);
// router.get("/", () => console.log("Get users"));
router.get("/:userId", () => console.log("GET users by ID"));
router.post("/", () => console.log("POST users"));

module.exports = router;
