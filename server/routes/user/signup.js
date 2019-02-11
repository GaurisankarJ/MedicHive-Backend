const _ = require("lodash");

const { User } = require("../../models/user.js");

const userSignUp = async (req, res) => {
    try {
        const body = _.pick(req.body, ["email", "password"]);
        const user = new User(body);

        await user.save();
        const token = await user.generateAuthToken();

        res.header("x-auth", token).send(user);
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        res.status(400).send();
    }
};

module.exports = { userSignUp };
