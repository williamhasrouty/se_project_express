const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const auth = require("./middlewares/auth");
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require("./middlewares/error-handler");
const { login, createUser } = require("./controllers/users");
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

app.use(cors());

app.post("/signin", login);
app.post("/signup", createUser);
app.get("/items", getClothingItems);

app.use(auth);

app.use("/", mainRouter);

app.use(requestLogger);
app.use(routes);

 // enabling the error logger
app.use(errorLogger);

// Celebrate error handling
app.use(errors());

// Add error handling middleware last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
