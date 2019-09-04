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

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res) => {
  const { id } = req.params;
  userDB
    .getUserPosts(id)
    .then(posts => {
      console.log(posts);
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "Could not retrieve the posts for the user" });
    });
});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;

  userDB
    .getById(id)
    .then(user => {
      console.log("user in validate", user);
      if (user) {
        req.user = user;
        console.log("user in req.user", req.user);
        next();
      } else {
        return res.status(400).json({ message: "Invalid user ID" });
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function validateUser(req, res, next) {}

function validatePost(req, res, next) {
  const { text } = req.body;

  if (!req.body) {
    return res.status(400).json({ message: "missing post data" });
  }

  if (!text) {
    return res.status(400).json({ message: "missing required text field" });
  }

  next();
}

module.exports = router;
