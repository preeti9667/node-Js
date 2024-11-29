const express = require("express");
var cookieParser = require("cookie-parser");
var createError = require("http-errors");

const app = express();
// const port = 3000
require("dotenv").config();
const cors = require("cors")

const PORT = process.env.PORT || 3000


var usersRouter = require("./src/app/routes/user.router");
var authRouter = require("./src/app/routes/auth.router");
var adminRouter = require("./src/app/routes/admin.router")
var meetingRouter = require("./src/app/routes/meeting.router")

const { mongodb } = require("./src/databases/mongodb");


var corsOptions = {
  origin: 'http://localhost:3001',
 method: "GET ,POST, PUT, DELETE , PATCH ",
 credentials: true,
}
app.use(cors(corsOptions));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));





app.use("/users", usersRouter);
app.use("/auth", authRouter)
app.use("/admin", adminRouter)
app.use("/meeting", meetingRouter);
mongodb();



app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.err(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


app.listen(PORT, () => {
  console.log(`app listening on port 3000`);
});
