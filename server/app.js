const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const HttpError = require("./modals/http-error");
const cors = require("cors");
const usersRoute = require("./routes/users-route");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/user", usersRoute);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(process.env.DB_CONN);
  .then(() => {
    app.listen(5000);
    console.log("connected");
  })
  .catch(err => {
    console.log("error", err);
  });
