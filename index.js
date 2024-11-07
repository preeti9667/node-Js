const express = require("express");
var cookieParser = require("cookie-parser");
var createError = require("http-errors");

const app = express();
const port = 3000;

var usersRouter = require("./src/app/routes/user.router");
const { mongodb } = require("./src/databases/mongodb");
app.use("/users", usersRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongodb();
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
