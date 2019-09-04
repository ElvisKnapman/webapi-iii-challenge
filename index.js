const server = require("./server");

const port = 8000;

server.listen(port, () => {
  console.log(`\nServer running on port ${port}\n`);
});
