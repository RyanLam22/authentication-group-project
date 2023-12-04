const passport = require('passport');
const User = require("../model/user.js")
const config = require("../configuration/config.js")
const jwt = require("jwt-simple");

exports.login = function (req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Error on the server.",error: err.toString() } );
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
    var payload = {
      id: user._id, 
      expire: Date.now() + 1000 * 60 * 60 * 24 * 7 // 1 week
    };
    var token = jwt.encode(payload, config.jwtSecret);
    res.json({ token });
  })(req, res, next);
};

exports.register = function (req, res) {
  var newUser = new User({ 
    username: req.body.username,
    email: req.body.email
  });
  
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      return res.send(err);
    }
    return res.json({ message: "Successfully registered", user: user });
  });
};

exports.profile = function(req, res) {
  res.json({
    message: 'You made it to the secured profile',
    user: req.user,
    token: req.query.secret_token
  })
};