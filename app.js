const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.set("strictQuery", false);

const routes = require("./routes/index");
// const mainRouter = require("./routes/index");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

// const app = express();

// const { PORT = 3001 } = process.env;

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());

app.use("/", routes);
// app.use("/", mainRouter);

// app.use(routes);

app.use(errors());

app.use(requestLogger);
app.use(routes);

app.use(errorLogger);

app.use(errors());
// app.use(errorHandler);

// app.use(errorHandler);
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

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server is running on port ${PORT");
});
