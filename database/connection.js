const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const db = new pg.Pool({
  connectionString,
  ssl: true,
});

module.exports = db;
