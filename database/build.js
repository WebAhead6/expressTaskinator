const fs = require("fs");
const path = require("path");
const db = require("./connection");

const initPath = path.join(__dirname, "init.sql");
const initSQL = fs.readFileSync(initPath, "utf-8");

exports.buildDB = () => {
  db.query(initSQL)
    .then(() => {
      console.log("database created");
      db.end();
    })
    .catch();
};
