const _ = require("lodash");

const { User } = require("./../models/user.js");

const userLogin = (req, res) => {
  var body = _.pick(req.body, ["email", "password"]);

  User.findByCredentials(body.email, body.password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.header("x-auth", token).send(user);
      });
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
};

module.exports = { userLogin };