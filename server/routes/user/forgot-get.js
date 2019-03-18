// User Model
const { User } = require("../../models/user.js");

// Send forgot password email
const { sendResetMail } = require("../../utils/mail.js");

const userForgotMe = async (req, res) => {
    try {
        // Get email from query body
        const { email } = req.query;

        // Check for email
        if (!email) {
            throw new Error();
        }

        // Find user with "email"
        const user = await User.findOne({ email });

        // Check for user
        if (!user) {
            throw new Error(404);
        }

        // Send reset mail asynchronously
        sendResetMail(email, user.confirmation[0].secret);

        // Send the status
        res.status(200).send();
    } catch (err) {
        if (err && process.env.NODE_ENV !== "test") { console.log(err); }
        // Not Found
        if (err.message === "404") {
            res.status(404).send();
        }
        // Error Bad Request
        res.status(400).send();
    }
};

module.exports = { userForgotMe };
