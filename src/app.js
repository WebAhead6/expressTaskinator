const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const favicon = require("serve-favicon");
const model = require("../model");

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
app.use(express.static(path.join(__dirname, "..", "public")));
// set the handlebars template path
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

const relativeDBpath = path.join(__dirname, "..", "data.json");

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

// homepage
app.get("/", (req, res) => {
  // console.log("we are rendering home!");
  let taskData = {};
  model.getAllTasks().then((data) => {
    // console.log(data);
    // here we are building a datastructure and sending it to the front end based on what is needed to be displayed
    data.forEach((ele) => {
      if (taskData[ele.taskid]) {
        taskData[ele.taskid].sub.push({
          text: ele.subtasktext,
          strike: ele.strike,
        });
      } else {
        if (ele.subtaskid) {
          taskData[ele.taskid] = {
            id: ele.taskid,
            text: ele.tasktext,
            sub: [{text: ele.subtasktext, strike: ele.strike}],
          };
        } else {
          taskData[ele.taskid] = {
            id: ele.taskid,
            text: ele.tasktext,
            sub: [],
          };
        }
      }
    });

    // console.log(taskData);
    res.render("home", {taskData});
  });
});

// add task handler
app.post("/addTask", (req, res) => {
  // console.log(req.body);
  model.createNewTask(req.body);
  res.redirect("/");
});

app.post("/addSubTask", (req, res) => {
  console.log("we are adding a new subtask in the taskList ==> ", req.body);
  model.createNewSubTask(req.body).then(() => {
    console.log("updated record successfully");
    res.redirect("/");
  });
});

app.post("/strikeTodo", (req, res) => {
  console.log("---------> strik ---> ", req.body);
  model.getSubtasksParentTask(req.body.paretTaskID).then((subtask) => {
    console.log("subtask ----------> ", subtask);
    subtask.forEach((sub) => {
      if (sub.subtasktext.trim() === req.body.toStrike.trim()) {
        model.toggleSubtask(sub.subtaskid).then(() => {
          res.redirect("/");
        });
      }
    });
  });
});

app.post("/deleteTask", (req, res) => {
  console.log("front end sent us this ==> :", req.body);
  model.deleteTask(req.body).then(() => {
    console.log("task deleted successfully, database about to be updated");
    res.redirect("/");
  });
});

module.exports = app;
