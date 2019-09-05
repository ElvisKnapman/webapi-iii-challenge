const express = require("express");

const server = express();

const userRouter = require("./users/userRouter.js");
const postRouter = require("./posts/postRouter.js");

server.use(express.json());
server.use(logger);

server.use("/users", userRouter);
server.use("/posts", postRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `${new Date().toISOString()} there was a ${req.method} request made to ${
      req.url
    }`
  );
  next();
}

module.exports = server;
