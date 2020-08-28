const express = require("express");
const router = express.Router();

const middleware = require("../middlewares/");
const home = require("./home");
const auth = require("./auth");
const error = require("./error");
const model = require("../models/model");

// homepage
router.get("/", middleware.authCheck, (req, res) => {
  // console.log("we are rendering home!");
  let taskData = {};
  model
    .getAllTasks()
    .then((data) => {
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
              user: ele.username,
              id: ele.taskid,
              text: ele.tasktext,
              sub: [{text: ele.subtasktext, strike: ele.strike}],
            };
          } else {
            taskData[ele.taskid] = {
              user: ele.username,
              id: ele.taskid,
              text: ele.tasktext,
              sub: [],
            };
          }
        }
      });

      // console.log(req.cookies);
      res.render("home", {taskData});
    })
    .catch((err) => {
      console.log("gettask did not work as intended! ", err);
      res.render("home");
    });
});

// add task handler
router.post("/addTask", middleware.authCheck, auth.addTask);

router.post("/addSubTask", middleware.authCheck, auth.addSubTask);

router.post("/strikeTodo", (req, res) => {
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

router.post("/deleteTask", (req, res) => {
  console.log("front end sent us this ==> :", req.body);
  model.deleteTask(req.body).then(() => {
    console.log("task deleted successfully, database about to be updated");
    res.redirect("/");
  });
});

router.get("/login", auth.loginPage);

router.get("/register", auth.registerPage);

router.post("/authenticate", auth.authenticate);

router.post("/addUser", auth.addUser);
router.get("/logout", middleware.authCheck, auth.logout);

router.use(error.client);
router.use(error.server);

module.exports = router;
