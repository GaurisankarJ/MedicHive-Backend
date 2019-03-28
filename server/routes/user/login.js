// Lodash
const _ = require("lodash");

// User Model
const { User } = require("../../models/user.js");

const userLogin = async (req, res) => {
    try {
        // Create body object from the request body
        const body = _.pick(req.body, ["email", "password"]);
        // Check email and password
        if (!body.email || !body.password) {
            throw new Error();
        }

        // Get user
        const user = await User.findByCredentials(body.email, body.password);
        // Check user
        if (!user) {
            throw new Error(404);
        }

        // Generate authentication token
        const token = await user.generateAuthenticationToken();

        // Send header, user body JSON
        res.header("x-auth", token).send(user);
    } catch (err) {
        if (err && process.env.NODE_ENV !== "test") { console.log(err); }
        // Not Found
        if (err && err.message === "404") {
            res.status(404).send();
        }
        // Error Bad Request
        res.status(400).send();
    }
};

module.exports = { userLogin };
