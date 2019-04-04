// Lodash
const _ = require("lodash");

// Send activation mail
const { sendActivationMail } = require("../../../utils/mail.js");

// User Model
const { User } = require("../../../models/user.js");

const postUserSignUp = async (req, res) => {
    try {
        // Create body object from request body
        const body = _.pick(req.body, ["email", "password", "userType"]);
        // Check email, password and userType
        if (!body.email || !body.password || !body.userType) {
            throw new Error();
        }

        // Create instance of User model
        const user = new User(body);
        // Save user instance
        await user.save();

        // Generate confirmation secret
        const secret = await user.generateConfirmationSecret();
        // Generate verification token
        const token = await user.generateAuthenticationToken();

        // Send activation mail asynchronously
        sendActivationMail(user.email, secret);

        // Send header and user body JSON
        res.header("x-auth", token).send(user);
    } catch (err) {
        if (err && process.env.NODE_ENV !== "test") { console.log(err); }
        // Error Bad Request
        res.status(400).send();
    }
};

module.exports = { postUserSignUp };
