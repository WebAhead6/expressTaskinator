const app = require("./app.js");
const http = require("http");
const port = process.env.PORT || 5555;
const router = require("./controllers/index");
const hostname = process.env.HOSTNAME || "localhost";

const server = http.createServer(router);
app.listen(port, () => {
  console.log(`Our app is running on http://localhost:${port}`);
});
