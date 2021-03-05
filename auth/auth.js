module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.user) {
      console.log(req.user)
      return next();
    }
    res.redirect('/');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.user) {
      return next();
    }
    res.redirect('/dashboard');      
  }
};