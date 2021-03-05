require('dotenv').config()
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../schemas/user');


module.exports = (passport) => {
    passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENTID,
    clientSecret:process.env.GITHUB_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
      function (accessToken, refreshToken, profile, done) {
    console.log(profile)
        User.findOrCreate({ githubid: profile.id }, {name:profile.username},function (err, user) {
      if (err) {
        console.log(err)
      } else {
        return done(err, user);
      }
      
    });
  }
));
}