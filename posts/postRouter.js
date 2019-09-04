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

router.put("/:id", (req, res) => {});

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
      console.log(err => {
        res.status(500).json({ message: "could not get post" });
      });
    });
}

module.exports = router;
