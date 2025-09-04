const router = require("express").Router();

const userRouter = require("./users");

const clothingItemRouter = require("./clothingItem");

// Users

router.use("/users", userRouter);

// Clothing Item

router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res.status(500).send({ message: "Router not found" });
});

module.exports = router;
