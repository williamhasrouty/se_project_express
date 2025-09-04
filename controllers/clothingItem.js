const { get } = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const createClothingItem = (req, res) => {
  console.log(req);
  console.log(res.body);

  const { name, weather, imageUrl, owner } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((clothingItem) => res.status(201).send(clothingItem))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItems) => res.status(200).send(clothingItems))
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: err.message });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Clothing item not found" });
      }
      return res
        .status(200)
        .send({ message: "Clothing item deleted", deletedItem });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      return res.status(500).send({ message: err.message });
    });
};
module.exports = { createClothingItem, getClothingItems, deleteClothingItem };
