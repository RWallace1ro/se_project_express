const ClothingItem = require("../models/clothingItem");
const { INVALID_DATA, NOT_FOUND, SERVER_ERROR, REQUEST_SUCCESSFUL, FORBIDDEN_ACCESS } = require("../utils/errors");

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(id)
    .orFail()
    .then((item) = )

    // console.log(itemId);
    // ClothingItem.deleteOne({ _id: itemId })
    //   .orFail()
    .then((item) => res.status(REQUEST_SUCCESSFUL).send(item))
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (itemId.owner === req.user._id) {
        return res
          .status(FORBIDDEN_ACCESS)
          .send({ message: "Not authorized to delete item" });
      }
      if (res.deletedCount === 0) {
        return res.status(FORBIDDEN_ACCESS).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};
