const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../errors/errors");

const {
  NOT_FOUND,
  REQUEST_SUCCESSFUL,
  REQUEST_CREATED,
} = require("../errors/errors");

const getItems = (_getItems, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(REQUEST_SUCCESSFUL).send(items))
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  if (!name || !weather || !imageUrl) {
    next(
      new BadRequestError("Name, weather, and imageUrl are required fields"),
    );
  }

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(REQUEST_CREATED).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findOne({ _id: itemId })
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }

      if (!item.owner.equals(req.user._id)) {
        throw new ForbiddenError("Not authorized to delete item");
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
        });
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )

    .orFail(new NotFoundError("Item not found"))
    .then((item) => res.status(REQUEST_SUCCESSFUL).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )

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
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
