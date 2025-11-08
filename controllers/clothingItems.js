const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const { BadRequestError, NotFoundError, ForbiddenError } = require("../utils/CustomErrors");
const {
  ERROR_CODE_CREATED,
  ERROR_CODE_OK,
} = require("../utils/errors");

const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((clothingItem) => res.status(ERROR_CODE_CREATED).send(clothingItem))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data."));
      } else {
        next(err);
      }
    });
};

const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((clothingItems) => res.status(ERROR_CODE_OK).send(clothingItems))
    .catch(next);
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail(() => new NotFoundError("Clothing item not found."))
    .then((item) => {
      if (item.owner.toString() !== userId) {
        throw new ForbiddenError("Forbidden.");
      }
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) =>
        res
          .status(ERROR_CODE_OK)
          .send({ message: "Clothing item deleted.", item: deletedItem })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data."));
      } else {
        next(err);
      }
    });
};

const likeClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    next(new BadRequestError("Invalid data."));
    return;
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found."))
    .then((item) => res.status(ERROR_CODE_OK).send(item))
    .catch(next);
};

const dislikeClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    next(new BadRequestError("Invalid data."));
    return;
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.status(ERROR_CODE_OK).send(item))
    .catch(next);
};

module.exports = {
  createClothingItem,
  getClothingItems,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
};
