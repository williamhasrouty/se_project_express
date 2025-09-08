const ClothingItem = require("../models/clothingItem");
const mongoose = require("mongoose");
const {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_INTERNAL_SERVER,
  ERROR_CODE_CREATED,
  ERROR_CODE_OK,
} = require("../utils/errors");

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((clothingItem) => res.status(ERROR_CODE_CREATED).send(clothingItem))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message:
            "Invalid data.",
        });
      }
      return res
        .status(ERROR_CODE_INTERNAL_SERVER)
        .send({ message: "An error has occurred on the server." });
    });
};

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItems) => res.status(ERROR_CODE_OK).send(clothingItems))
    .catch((err) => {
      console.log(err);
      return res
        .status(ERROR_CODE_INTERNAL_SERVER)
        .send({ message: "An error has occurred on the server." });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (!item) {
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: "Clothing item not found" });
      }
      return res
        .status(ERROR_CODE_OK)
        .send({ message: "Clothing item deleted", item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODE_BAD_REQUEST)
          .send({ message: "Invalid data." });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: "Clothing item not found" });
      }
      return res
        .status(ERROR_CODE_INTERNAL_SERVER)
        .send({ message: "An error has occurred on the server." });
    });
};

const likeClothingItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(ERROR_CODE_BAD_REQUEST)
      .send({ message: "Invalid data." });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: "Item not found." });
      }
      return res.status(ERROR_CODE_OK).send(item);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_CODE_INTERNAL_SERVER)
        .send({ message: "Internal server error" });
    });
};

const dislikeClothingItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(ERROR_CODE_BAD_REQUEST)
      .send({ message: "Invalid data." });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: "Item not found" });
      }
      return res.status(ERROR_CODE_OK).send(item);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_CODE_INTERNAL_SERVER)
        .send({ message: "Internal server error" });
    });
};

module.exports = {
  createClothingItem,
  getClothingItems,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
};
