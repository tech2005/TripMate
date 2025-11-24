


module.exports.isLoggedIn = (req , res, next) => {
  




if(!req.isAuthenticated()){
  req.session.redirectUrl = req.originalUrl;
  request.flash("error", "You are must be logged in to creat listing!");

    req.flash("error", "you must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
  }
  module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  next();
};
