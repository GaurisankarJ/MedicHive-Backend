const _ = require("lodash");

const { User } = require("../../models/user.js");

const userLogin = async (req, res) => {
    try {
        const body = _.pick(req.body, ["email", "password"]);

        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();

        res.header("x-auth", token).send(user);
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        res.status(400).send();
    }
};

module.exports = { userLogin };
