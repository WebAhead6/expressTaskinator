// use these functions to manipulate our database
const {
  findByUsername,
  addNewUser,
  createNewTask,
  getUsernameId,
  createNewSubTask,
} = require("../models/model");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

exports.loginPage = (req, res) => {
  res.render("login", {activePage: {login: true}});
};
exports.registerPage = (req, res) => {
  res.render("register", {activePage: {register: true}});
};

// This function handles the POST /addUser route
// checks if the password and confirmPassword are equal if not send back
// a proper error messagetoken ------>
// hash the password, then add the new user to our database using the v addNewUser method
// make sure to handle any error that might occured
exports.addUser = async (req, res, err) => {
  console.log(req.body, " <======= addUser req body ==============");
  try {
    if (req.body.password !== req.body.confirmPassword)
      throw new Error("passwords do not match");
    if (!req.body.username.length) {
      throw new Error("Please Enter valid data - fields can not be blank");
    }
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    // Store hash in your password DB.
    console.log("server side =>", req.body.username, hash);

    await addNewUser(req.body.username, req.body.email, hash);

    res.render("home");
  } catch (err) {
    res.render("register", {error: "server error ===> " + err.message});
  }
};

// this function handles the POST /authenticate route
// it finds the user in our database by his username that he inputed
// then compares the password that he inputed with the one in the db
// using bcrypt and then redirects back to the home page
// make sure to look at home.hbs file to be able to modify the home page when user is logged in
// also handle all possible errors that might occured by sending a message back to the cleint
exports.authenticate = (req, res) => {
  // console.log(req.body);
  let username = req.body.username;
  let password = req.body.password;
  console.log(
    username +
      "<---------------------------------------------------------------req.body.username"
  );
  findByUsername(username)
    .then((serverRes) => {
      console.log("userdata =>", serverRes);

      bcrypt.compare(password, serverRes.password, function (err, result) {
        // result == false
        if (err) {
          res.render("login", {
            error: `error occured during comparison`,
          });
        }

        if (result) {
          //sign the cookie for security
          const dataToDecode = {
            activePage: {signedIn: true, username: username},
          };

          jwt.sign(dataToDecode, process.env.JWT_SECRET, function (err, token) {
            if (err) {
              // handle error
              console.log("error with cookie signing");
              throw new Error();
            }
            // console.log("user authenticated!!!! ---->");

            // console.log("cookietoken-->", token);
            res.cookie("access_token", token, {
              httpOnly: true,
            });
            res.redirect("/");
          });
        } else {
          res.render("login", {
            error: `the userpassword for ${username} doesnt match `,
          });
        }
      });
    })
    .catch((err) => {
      console.log("error occured while trying to find user :", err);
      res.render("login", {error: `the user ${username} does not exist`});
    });
};

exports.logout = (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/");
};

exports.addTask = (req, res) => {
  const data = {
    ...req.body,
    username: res.locals.activePage.username,
  };
  createNewTask(data);
  res.redirect("/");
};

exports.addSubTask = async (req, res) => {
  console.log("we are adding a new subtask in the taskList ==> ", req.body);
  let author_id = await getUsernameId(res.locals.activePage.username);

  let data = {
    ...req.body,
    author_id: author_id.rows[0].userid,
  };
  console.log("we are adding a new subtask : req.body to ==> ", data);

  await createNewSubTask(data);
  console.log("updated record successfully");
  res.redirect("/");
};
