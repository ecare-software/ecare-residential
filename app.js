var createError = require('http-errors');
var express = require('express');
var path = require('path');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//routes
var users = require('./routes/api/users');

//user express
var app = express();

//  Body Parser middleware
app.use(bodyParser.json());

// get/connet to db
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db,{ useNewUrlParser: true,useUnifiedTopology: true })
  .then(() => console.log("connected to db"))
  .catch(err => {"failed-"+console.log(err)});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public'))); //old

app.use(express.static(path.join(__dirname, 'client/build'))); //new
//test
app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname + "/client/build/index.html"))
  // res.sendFile(path.join(__dirname + "/index.html"))
})

//use routes
app.use('/api/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
