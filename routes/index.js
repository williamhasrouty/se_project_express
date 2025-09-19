const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { ERROR_CODE_NOT_FOUND } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);

// Users
router.use("/users", userRouter);

// Clothing Item
router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: "Route not found" });
});

module.exports = router;
