const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  // ConflictError,
  // errorHandler,
} = require("../middlewares/error-handler");

const {
  INVALID_DATA,
  NOT_FOUND,
  SERVER_ERROR,
  REQUEST_SUCCESSFUL,
  REQUEST_CREATED,
  // FORBIDDEN_ACCESS,
} = require("../utils/errors");

const getItems = (_getItems, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(REQUEST_SUCCESSFUL).send(items))
    .catch(next);
  // console.error(err);
  //   return res
  //     .status(SERVER_ERROR)
  //     .send({ message: "An error has occurred on the server." });
  // });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(REQUEST_CREATED).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
        // (INVALID_DATA).send("Invalid data"));
      } else {
        next(err);
      }
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findOne({ _id: itemId })
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
        //  return res.status(NOT_FOUND).send({ message: "Item not found" });
      }

      if (!item.owner.equals(req.user._id)) {
        throw new ForbiddenError("Not authorized to delete item");
        // return res
        //   .status(FORBIDDEN_ACCESS)
        //   .send({ message: "Not authorized to delete item" });
      }

      return ClothingItem.deleteOne({ _id: itemId })
        .then(() =>
          res
            .status(REQUEST_SUCCESSFUL)
            .send({ message: "Item successfully deleted" }),
        )
        .catch((err) => {
          if (err.name === "CastError") {
            next(new BadRequestError("Invalid data"));
          } else {
            next(err);
          }
          // console.error(err);
          // return res
          //   .status(SERVER_ERROR)
          //   .send({ message: "An error has occurred on the server." });
        });
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: "Invalid data" });
      }

      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    // .orFail()
    .orFail(new NotFoundError("Item not found"))
    .then((item) => res.status(REQUEST_SUCCESSFUL).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    // .orFail()
    .orFail(new NotFoundError("Item not found"))
    .then((item) => res.status(REQUEST_SUCCESSFUL).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
      // return res.status(INVALID_DATA).send({ message: "Invalid data" });

      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
