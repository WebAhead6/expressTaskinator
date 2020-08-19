const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const favicon = require("serve-favicon");

const taskData = require("../data.json");

const compression = require("compression");
const fs = require("fs");

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

// instruct express to get all our static pages (style.css , etc.)
app.use(express.static(path.join(__dirname, "..", "public"), {maxAge: "30d"}));
// set the handlebars template path
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

const relativeDBpath = path.join(__dirname, "..", "data.json");

// database getters and setters
const getDatabase = () => {
  return taskData;
};

const setToDatabase = (obj) => {
  let data = getDatabase();
  data.push(obj);
  console.log(data);
  fs.writeFileSync(relativeDBpath, JSON.stringify(data));
};

const searchDBandToggle = (id, text) => {
  getDatabase().forEach((e) => {
    if (e.id === id) {
      e.subtasks.forEach((subt) => {
        if (subt.text === text) {
          if (subt.strike) {
            subt.strike = false;
          } else {
            subt.strike = true;
          }
        }
      });
    }
  });
};

const updateDatabase = (newData) => {
  fs.writeFileSync(relativeDBpath, JSON.stringify(newData));
};

let IDgenerator = () => {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substr(2, 9);
};

const addNewTask = (taskObj) => {};

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

app.get("/", (req, res) => {
  console.log("we are rendering home!");
  getDatabase();
  res.render("home", {
    data: taskData,
  });
});

app.post("/addTask", (req, res) => {
  let id = IDgenerator();

  let taskAdded = {
    id,
    ...req.body,
  };

  console.log("we are adding new data in the form of: ==>", taskAdded);
  setToDatabase(taskAdded);
  res.redirect("/");
});

app.post("/addSubTask", (req, res) => {
  console.log("we are adding a new subtask in the taskList ==> ", req.body);
  res.redirect("/");
});

app.post("/strikeTodo", (req, res) => {
  console.log("---------> strik ---> ", req.body);
  searchDB(req.body.taskID);
});

module.exports = app;
