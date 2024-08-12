const appError = require("../utilities/appError");

module.exports = (...roles) => {
  // ['ADMIN']
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      //Any thing tried to delete
      return next(appError.create("this role is not authorized", 401));
    }
    next();
  };
};
