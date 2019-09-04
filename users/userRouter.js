const express = require("express");
const userDB = require("./userDb.js");

const router = express.Router();

router.post("/", (req, res) => {});

router.post("/:id/posts", (req, res) => {});

router.get("/", (req, res) => {
  userDB
    .get()
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "could not treieve users from the database" });
    });
});

router.get("/:id", (req, res) => {});

router.get("/:id/posts", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

//custom middleware

function validateUserId(req, res, next) {}

function validateUser(req, res, next) {}

function validatePost(req, res, next) {}

module.exports = router;
