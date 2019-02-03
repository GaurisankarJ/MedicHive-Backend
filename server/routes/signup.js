const _ = require("lodash");

const { User } = require("./../models/user.js");

const userSignUp = (req, res) => {
    var body = _.pick(req.body, ["email", "password"]);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header("x-auth", token).send(user);
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    });
};

module.exports = { userSignUp };