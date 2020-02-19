// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.json([
//     {id:1,username:"someone"},
//     {id:2,username:"someone else"}
//   ])
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

// user model
const User = require("../../models/User");

// @route   GET api/items
// @desc    GET all items
// @access  Public
router.get("/:email/:password", (req, res) => {
  User.findOneAndUpdate({ email: req.params.email, password: req.params.password },{
    lastLogIn:new Date().toISOString()
  },{new:true})
    .then(user => {
      res.json(user);
    })
    .catch(err => res.status(404).json({ success: false }));
});

// @route   GET api/items
// @desc    GET all items
// @access  Public
router.get("/:homeId", (req, res) => {
  User.find({ homeId: req.params.homeId })
    .then(Users => res.json(Users))
    .catch(err => res.status(404).json({ success: false }));
});

// @route   GET api/items
// @desc    GET all items
// @access  Public
router.get("/", (req, res) => {
  User.find().then(user => {
    res.json(
      user.map(u => {
        return {
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email
        };
      })
    );
  });
});

// @route   POST api/items
// @desc    Create an item
// @access  Public

router.post("/", (req, res) => {
  const newUser = new User({
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    homeId: req.body.homeId,
    jobTitle: req.body.jobTitle,
    isAdmin: req.body.isAdmin,
    newUser: true
  });
  newUser.save().then(user => res.json(user));
});

// @route   PUT api/items
// @desc    Create an item
// @access  Public
router.put("/:id", (req, res) => {
  User.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function() {
    User.findOne({ _id: req.params.id }).then(user => {
      res.send(user);
    });
  });
});

// ('/:password/:id', function (req, res) {
//   User.update(
//     {password: req.body.password},
//     {where: req.body.id}
//   )
//   .then(function(rowsUpdated) {
//     res.json(rowsUpdated)
//   })
//   .catch(err=>console.log)
//  })

// @route   Delete api/items
// @desc    Delete an item
// @access  Public
router.delete("/:id", (req, res) => {
  User.findById(req.params.id)
    .then(user => user.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
