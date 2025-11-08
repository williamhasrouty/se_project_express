const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUserUpdate } = require("../middlewares/validator");
const auth = require("../middlewares/auth");

router.get("/me", getCurrentUser);
router.patch("/me", auth, validateUserUpdate, updateProfile);

module.exports = router;
