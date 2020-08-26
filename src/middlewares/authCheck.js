// import middleware here
const jwt = require("jsonwebtoken");

function authCheck(req, res, next) {
  let token = req.cookies.access_token;
  // let decoded = jwt.verify(token, process.env.JWT_SECRET);
  // console.log("token ------>", token);

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        console.log("something bad occured");
        res.locals = {activePage: {signedIn: false, username: null}};

        next();
      }

      res.locals = decoded;
      next();
    });
  } else {
    res.locals = {activePage: {signedIn: false, username: null}};

    next();
  }
}

module.exports = authCheck;
