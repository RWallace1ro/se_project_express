const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

mongoose.set("strictQuery", false);

const routes = require("./routes/index");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", routes);

app.use(errors());

app.use(requestLogger);
app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler, () => {
  console.log("Middleware function called");
  next();
});

app.use((err, req, res, next) => {
  console.log("Test Middleware Function");
  res.status(500).send("Test Error Middleware");
  next();
});

app.use((req, res, next) => {
  console.log("Middleware function called");
  res.send("Middleware function called");
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
