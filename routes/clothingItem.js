const router = require("express").Router();

const {
  createClothingItem,
  getClothingItems,
  deleteClothingItem,
} = require("../controllers/clothingItem");

// POST /items

router.post("/", createClothingItem);

// GET /items

router.get("/", getClothingItems);

// DELETE /items/:itemId

router.delete("/:itemId", deleteClothingItem);

module.exports = router;
