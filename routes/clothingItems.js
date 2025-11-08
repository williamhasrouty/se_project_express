const router = require("express").Router();
const {
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
} = require("../controllers/clothingItems");
const {
  validateClothingItem,
  validateClothingItemId,
  validateClothingItemOperation,
} = require("../middlewares/validator");

// POST /items
router.post("/", validateClothingItem, createClothingItem);

// DELETE /items/:itemId
router.delete("/:itemId", validateClothingItemId, deleteClothingItem);

// PUT /items/:itemId/likes
router.put("/:itemId/likes", validateClothingItemId, likeClothingItem);

// DELETE /items/:itemId/likes
router.delete("/:itemId/likes", validateClothingItemId, dislikeClothingItem);

module.exports = router;
