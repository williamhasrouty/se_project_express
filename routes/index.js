const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const NotFoundError = require("../utils/CustomErrors/NotFoundError");

// Users
router.use("/users", userRouter);

// Clothing Item
router.use("/items", clothingItemRouter);

router.use((req, res) => {
  throw new NotFoundError("Route not found");
});

module.exports = router;
