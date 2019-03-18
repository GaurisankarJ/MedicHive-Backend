// Lodash
const _ = require("lodash");

// SendGrid, send confirmation mail
const { sendConfirmationMail } = require("../../utils/mail.js");

// User Model
const { User } = require("../../models/user.js");

const userSignUp = async (req, res) => {
    try {
        // Create body object from the request body
        const body = _.pick(req.body, ["email", "password", "userType"]);

        // Create an instance of User model
        const user = new User(body);
        // Save the user instance
        await user.save();
        // Generate confirmation secret
        await user.generateConfirmationSecret();
        // Generate verification token
        const token = await user.generateAuthToken();

        // Send confirmation male asynchronously
        sendConfirmationMail(user.email, user.confirmation[0].secret);

        // Send the header and body
        res.header("x-auth", token).send(user);
    } catch (err) {
        if (err && process.env.NODE_ENV !== "test") { console.log(err); }
        // Error Bad Request
        res.status(400).send();
    }
};

module.exports = { userSignUp };
