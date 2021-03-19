const createError = require("http-errors");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const methodOverride = require("method-override");

//routes
const users = require("./routes/api/users");
const treatmentPlans72 = require("./routes/api/treatmentPlans72");
const incidentReport = require("./routes/api/incidentReport");
const restraintReport = require("./routes/api/restraintReport");
const dailyProgressAndActivity = require("./routes/api/dailyProgressAndActivity");
const directMessages = require("./routes/api/directMessages");
const discussionMessages = require("./routes/api/discussionMessages");
const illnessInjury = require("./routes/api/illnessInjury");
const admissionAssessment = require("./routes/api/admissionAssessment");
const bodyCheck = require("./routes/api/bodyCheck");
const orientationTraining = require("./routes/api/orientationTraining");
const preServiceTraining = require("./routes/api/preServiceTraining");
const orientationTrainingMod = require("./routes/api/orientationTrainingMod");
const client = require("./routes/api/client");
const email = require("./routes/api/email");
const uploadDocument = require("./routes/api/uploadDocument");

//user express
const app = express();
// email test

//  Body Parser middleware
app.use(bodyParser.json());
app.use(methodOverride("_method"));

// get/connet to db
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to db"))
  .catch((err) => {
    "failed-" + console.log(err);
  });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "client/build"))); //new

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
app.get("/reports", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

//use routes
app.use("/api/users", users);
app.use("/api/treatmentPlans72", treatmentPlans72);
app.use("/api/incidentReport", incidentReport);
app.use("/api/restraintReport", restraintReport);
app.use("/api/dailyProgressAndActivity", dailyProgressAndActivity);
app.use("/api/directMessages", directMessages);
app.use("/api/discussionMessages", discussionMessages);
app.use("/api/illnessInjury", illnessInjury);
app.use("/api/admissionAssessment", admissionAssessment);
app.use("/api/bodyCheck", bodyCheck);
app.use("/api/orientationTraining", orientationTraining);
app.use("/api/preServiceTraining", preServiceTraining);
app.use("/api/client", client);
app.use("/api/email", email);
app.use("/api/uploadDocument", uploadDocument);
app.use("/api/orientationTrainingMod", orientationTrainingMod);
app.use("/uploads", express.static("uploads"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
