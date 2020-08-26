const auth = require("../middlewares/authCheck");

exports.get = (req, res) => {
  // console.log("we in home", res.cookies);
  res.render("home", res.locals);
};
