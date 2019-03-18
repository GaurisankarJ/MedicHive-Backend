// Lodash
const _ = require("lodash");

const { User } = require("../../models/user.js");

const userLogin = async (req, res) => {
    try {
        // Create body object from the request body
        const body = _.pick(req.body, ["email", "password"]);

        // Check email and password
        if (!body.email || !body.password) {
            throw new Error();
        }

        // Find user by credentials
        const user = await User.findByCredentials(body.email, body.password);
        if (!user) {
            throw new Error(404);
        }

        // Generate authentication tokens
        const token = await user.generateAuthToken();

        // Send the header and body
        res.header("x-auth", token).send(user);
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        // Not Found
        if (err && err.message === "404") {
            res.status(404).send();
        }
        // Error Bad Request
        res.status(400).send();
    }
};

module.exports = { userLogin };
