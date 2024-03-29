const ClothingItem = require("../models/clothingItem");
const {
  INVALID_DATA,
  NOT_FOUND,
  SERVER_ERROR,
  REQUEST_SUCCESSFUL,
  REQUEST_CREATED,
} = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(REQUEST_SUCCESSFUL).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => res.status(REQUEST_CREATED).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => res.status(REQUEST_SUCCESSFUL).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

// const deleteItem = (req, res) => {
//   const { itemId } = req.params;
//   ClothingItem.findByIdAndDelete(itemId)

//     .then((item) => {
//       if (!item) {
//         return res.status(NOT_FOUND).send({ message: "Item not found" });
//       }
//       return res.status(REQUEST_SUCCESSFUL).send(item);
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "CastError" || err.name === "DocumentNotFoundError") {
//         return res.status(NOT_FOUND).send({ message: err.message });
//       }
//       return res.status(SERVER_ERROR).send({ message: err.message });
//     });
// };

const likeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(itemId)
    .orFail()
    .then((item) => res.status(REQUEST_SUCCESSFUL).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => res.status(REQUEST_SUCCESSFUL).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(REQUEST_SUCCESSFUL).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id);
  return res.status(REQUEST_SUCCESSFUL).send({ message: "Item created" });
};

module.exports.likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
    res.status(REQUEST_SUCCESSFUL).send({ message: "Item liked" }),
  );

module.exports.dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
    res.status(REQUEST_SUCCESSFUL).send({ message: "Item disliked" }),
  );
module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
