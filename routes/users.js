const router = require("express").Router();
const { login } = require("../controllers/users");
const { getCurrentUser } = require("../controllers/users");
const { updateProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.post("/login", login);
router.get("/me", getCurrentUser);

router.patch("/me", auth, updateProfile);

module.exports = router;
