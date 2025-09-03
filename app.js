const express = require("express");
const { mongoose } = require("mongoose");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db").then(() => {
  // eslint-disable-next-line no-console
  console.log("Connected to MongoDB");
}).catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Error connecting to MongoDB:", err);}
);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is running at http://localhost:${PORT}`);
});
