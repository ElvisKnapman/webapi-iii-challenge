require("dotenv").config();
const server = require("./server");

const port = process.env.PORT || 7000;

server.listen(port, () => {
  console.log(`\nServer running on port ${port}\n`);
});
