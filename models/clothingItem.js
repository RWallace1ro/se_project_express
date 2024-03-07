const mongoose = require("mongoose");
const router = require("express").Router();
// const mainRouter = require("./routes/index");

router.get("/", () => console.log("GET clothingItems"));
router.post("/:userId", () => console.log("POST clothingItems"));
router.delete("/", () => console.log("Delete clothingItems by ID"));

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlenght: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  Owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    Default: Date.now,
  },
});

module.exports = mongoose.model("item", clothingItemSchema);
