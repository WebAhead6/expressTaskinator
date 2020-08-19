const app = require("./app.js");

const port = 5555;
app.listen(port, () => {
  console.log(`Our app is running on http://localhost:${port}`);
});
