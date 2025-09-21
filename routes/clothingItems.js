const router = require("express").Router();

const {
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
} = require("../controllers/clothingItems");

// POST /items

router.post("/", createClothingItem);

// DELETE /items/:itemId

router.delete("/:itemId", deleteClothingItem);

// PUT /items/:itemId/likes

router.put("/:itemId/likes", likeClothingItem);

// DELETE /items/:itemId/likes

router.delete("/:itemId/likes", dislikeClothingItem);

module.exports = router;
