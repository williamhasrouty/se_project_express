const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const auth = require("./middlewares/auth");
const cors = require("cors");
const { login, createUser, updateProfile } = require("./controllers/users");

const { getClothingItems } = require("./controllers/clothingItems");

const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(express.json());

app.post("/signin", login);
app.post("/signup", createUser);
app.get("/items", getClothingItems);
app.put("/users/me", auth, updateProfile);

app.use(auth);
app.use(cors());
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
