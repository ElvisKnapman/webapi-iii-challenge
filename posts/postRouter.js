const express = require("express");
const postDB = require("./postDb");
const router = express.Router();

router.get("/", (req, res) => {
  postDB
    .get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "could not retrieve posts" });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  // middleware above (validatePostId) attaches the post to req.post
  res.status(200).json(req.post);
});

router.delete("/:id", validatePostId, (req, res) => {
  const { id } = req.params;

  postDB
    .remove(id)
    .then(result => {
      // result contains number of records deleted
      if (result) {
        res.status(200).json({ message: "post successfully deleted" });
      } else {
        res.status(400).json({ message: "no posts were deleted" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "post could not be deleted" });
    });
});

router.put("/:id", validatePostId, validatePost, (req, res) => {
  const { id } = req.params;
  const updatedPost = req.body;

  postDB
    .update(id, updatedPost)
    .then(result => {
      // result contains number of records deleted
      if (result) {
        res.status(200).json({ message: "post was updated successfully" });
      } else {
        res.status(400).json({ message: "post could not be updated" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "post could not be updated by server" });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;

  postDB
    .getById(id)
    .then(post => {
      console.log("POST ON POST MIDDLEWARE", post);
      if (post) {
        req.post = post;
        next();
      } else {
        return res.status(404).json({ message: "invalid post ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "could not get post" });
    });
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
