// User Model
const { User } = require("../../models/user.js");

// Send forgot password mail
const { sendResetMail } = require("../../utils/mail.js");

const userForgotSend = async (req, res) => {
    try {
        // Get email from query body
        const { email } = req.query;
        // Check email
        if (!email) {
            throw new Error();
        }

        // Get user
        const user = await User.findOne({ email });
        // Check user
        if (!user) {
            throw new Error(404);
        }

        // Generate confirmation secret
        const secret = await user.generateConfirmationSecret();

        // Send reset mail asynchronously
        await sendResetMail(email, secret);

        // Send JSON body
        res.json({ message: "password reset mail sent successfully", email });
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

const userForgotMe = async (req, res) => {
    try {
        // Get secret from params body
        const { secret } = req.params;
        // Get password from request body
        const { password } = req.body;
        // Check secret, password
        if (!secret || !password) {
            throw new Error();
        }

        // Get user
        const user = await User.findBySecret(secret);

        // Check user password same as value
        const check = await User.findByCredentials(user.email, password);
        if (check) {
            throw new Error();
        }

        // Patch password
        await User.updateOne(
            { _id: user._id },
            { $set: { password } }
        );

        // Redirect to home
        res.redirect(process.env.HOME_PAGE);
    } catch (err) {
        if (err && process.env.NODE_ENV !== "test") { console.log(err); }
        // Error Bad Request
        res.status(400).send();
    }
};

module.exports = { userForgotSend, userForgotMe };
