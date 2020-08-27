// import middleware here
const jwt = require("jsonwebtoken");

function passRetriever(req, res, next) {
  let token = req.cookies.access_token;

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      console.log("something bad occured");
    }

    res.locals = decoded;
    console.log(decoded);
    next();
  });
}

module.exports = authCheck;
