const express = require("express");
const router = express.Router(); 
const ROUTER = require("/routes/user.js");


// Index - users
router.get("/users", (req, res) => {
  res.send("GET for users");
});

// Show - single user
router.get("/users/:id", (req, res) => {
  res.send(`GET for user id: ${req.params.id}`);
});

// POST - create user
router.post("/users", (req, res) => {
  res.send("POST for users");
});

// DELETE - delete user
router.delete("/users/:id", (req, res) => {
  res.send("DELETE for user id");
});

module.exports = router; 



