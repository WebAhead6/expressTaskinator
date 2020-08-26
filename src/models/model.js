const db = require("../../database/connection");
const fs = require("fs");

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
async function getUsernameId(username) {
  try {
    const user = await db.query(
      `
  SELECT userid from users where username = $1
  `,
      [username]
    );

    return user;
  } catch (error) {
    console.log("something went wrong during getUsereID db query", err);
  }
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

async function createNewTask(data) {
  const query = await getUsernameId(data.username);
  const userid = query.rows[0].userid;
  const values = [data.tasktext, userid, data.taskdate];
  // console.log(values);
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

async function findByUsername(username) {
  try {
    const userData = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    console.log(userData.rows, "<============================ ");
    if (!userData.rows.length) {
      throw new Error("No user was found");
    }
    return userData.rows[0];
  } catch (error) {
    console.log(`findByUsername Error: ${error.message}`);
    throw Error(`An error has occurred in the db, ${error.message}`);
  }
}

async function addNewUser(username, email, password) {
  try {
    // EXISTS returns the following [ { exists: BOOLEAN } ]
    // const data = await db.query(
    //   "SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)",
    //   username
    // );
    // console.log(data[0].exists);
    const {
      rows: [{exists}],
    } = await db.query(
      "SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)",
      [username]
    );
    if (exists) {
      throw new Error("User already exists in our database");
    }

    // adds the user to the db
    await db.query(
      "INSERT INTO users (username,email, password) VALUES ($1, $2, $3)",
      [username, email, password]
    );

    return "User has been added";
  } catch (error) {
    console.log(`addNewUser Error: ${error}`);
    throw Error(`${error.message}`);
  }
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
  findByUsername,
  addNewUser,
  getUsernameId,
};
