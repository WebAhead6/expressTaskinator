const db = require("./database/connection");

function getAllTasks() {
  return db
    .query(
      "select * from tasks left join users ON users.userid = tasks.author_id left join subtasks on subtasks.task_id = tasks.taskid "
    )
    .then((results) => {
      return results.rows;
    })
    .catch((err) => {
      console.log("something went wrong during db query", err);
    });
}

function getTaskSubtasks(taskid) {
  return db
    .query(
      `
        SELECT *
        FROM subtasks WHERE subtasks.task_id = $1
        `,
      [`${taskid}`]
    )
    .then((resutls) => {
      return resutls.rows;
    })
    .catch((err) => {
      console.log("something went wrong during db query", err);
    });
}

function getAllTasksOfUser(userid) {
  console.log(userid);
  return db
    .query(
      `
        SELECT *
         FROM tasks 
        WHERE author_id = $1
        `,
      [userid]
    )

    .then((results) => results.rows)
    .catch((err) => {
      console.log("something went wrong during db query", err);
    });
}

function getSubtasksParentTask(parentTaskID) {
  return db
    .query(
      `
    SELECT * FROM subtasks WHERE task_id = $1
    `,
      [parentTaskID]
    )
    .then((results) => results.rows)
    .catch((err) => {
      console.log("something went wrong during db query", err);
    });
}

function toggleSubtask(subtaskid) {
  //   console.log(values);
  return db
    .query(
      `
    UPDATE subtasks SET strike = NOT COALESCE( strike, 'f' ) where subtaskid = $1`,
      [subtaskid]
    )
    .catch((err) => {
      console.log("something went wrong during db query", err);
    });
}

function createNewTask(data) {
  const values = [data.tasktext, data.author_id, data.taskdate];
  console.log(values);
  return db
    .query(
      `
    INSERT INTO tasks (tasktext, author_id,taskdate) 
    VALUES($1,$2,$3)`,
      values
    )
    .catch((err) => {
      console.log("something went wrong during db query", err);
    });
}

function createNewSubTask(data) {
  const values = [data.subtasktext, data.author_id, data.task_id, false];
  return db
    .query(
      `INSERT INTO subtasks (subtasktext, author_id, task_id, strike) 
    VALUES($1,$2,$3,$4)
    `,
      values
    )
    .catch((err) => {
      console.log("something went wrong during db query", err);
    });
}

function createNewUser(data) {
  const values = [data.username, data.email, data.userpass];
  return db
    .query(
      `INSERT INTO users (username, email,userpass) VALUES ($1,$2,$3)
    `,
      values
    )
    .catch((err) => {
      console.log("something went wrong during db query", err);
    });
}

function deleteTask(dataObj) {
  if (dataObj.flag === "main") {
    return db
      .query(
        `delete FROM subtasks WHERE subtasks.task_id = $1 
    `,
        [dataObj.taskid]
      )
      .then(() => {
        return db.query(`delete from tasks where taskid = $1`, [
          dataObj.taskid,
        ]);
      })
      .catch((err) => {
        console.log("something went wrong during db query", err);
      });
  } else if (dataObj.flag === "sub") {
    console.log("deleting a sub -----fdesgrhtjyfthdrgershdtjfykugyj");
    return db
      .query(
        `
      delete FROM subtasks WHERE subtasks.task_id = $1 and subtasktext = $2 `,
        [dataObj.taskid, dataObj.text]
      )
      .catch((err) => {
        console.log("something went wrong during db query", err);
      });
  }
}
module.exports = {
  createNewUser,
  createNewSubTask,
  createNewTask,
  getSubtasksParentTask,
  getAllTasksOfUser,
  getTaskSubtasks,
  getAllTasks,
  toggleSubtask,
  deleteTask,
};
