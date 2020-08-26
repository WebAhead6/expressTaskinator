const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const favicon = require("serve-favicon");
const model = require("./models/model");
const cookieParser = require("cookie-parser");

const compression = require("compression");
const fs = require("fs");
const controllers = require("./controllers/index");
require("dotenv").config();

const app = express();

// disable powered by express header
app.disable("x-powered-by");

// set port number
app.set("port", process.env.PORT || 5555);

// use compression middleware
app.use(compression());
app.use(favicon(path.join(__dirname, "..", "public", "favicon.ico")));
//to be able to prase what our site is sending the server we need ->
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
// instruct express to get all our static pages (style.css , etc.)
app.use(express.static(path.join(__dirname, "..", "public")));
// set the handlebars template path
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

const relativeDBpath = path.join(__dirname, "..", "data.json");

//setting up the app engine, includinng all the helper functions
app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
    defaultLayout: "main",
    helpers: {},
  })
);

app.set("port", process.env.PORT || 3000);
app.use(controllers);

module.exports = app;
