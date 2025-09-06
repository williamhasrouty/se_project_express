const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { ERROR_CODE_NOT_FOUND } = require("../utils/errors");

// Users

router.use("/users", userRouter);

// Clothing Item

router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
