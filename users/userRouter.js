const express = require("express");
const userDB = require("./userDb.js");
const postDB = require("../posts/postDb.js");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  const newUser = req.body;
  userDB
    .insert(newUser)
    .then(resource => {
      res.status(201).json(resource);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "new user could not be created" });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const { id } = req.params;
  let post = req.body;
  post.user_id = id;
  console.log("the post", post);

  postDB
    .insert(post)
    .then(resource => {
      console.log(resource);
      res.status(201).json(resource);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Post could not be added" });
    });
});

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

function validateUser(req, res, next) {
  const { body } = req;
  // empty request body is empty object, check for valid properties
  const bodyData = Object.keys(body);

  if (bodyData.length === 0) {
    console.log("body data in new user validate", bodyData);
    return res.status(400).json({ message: "missing user data" });
  }

  if (!body.name) {
    return res.status(400).json({ message: "missing required name field" });
  }

  next();
}

function validatePost(req, res, next) {
  const { text } = req.body;
  // empty request body is empty object, check for valid properties
  const bodyData = Object.keys(req.body);
  console.log("the body", req.body);

  // if no properties on object
  if (bodyData.length === 0) {
    return res.status(400).json({ message: "missing post data" });
  }

  if (!text) {
    return res.status(400).json({ message: "missing required text field" });
  }

  next();
}

module.exports = router;
