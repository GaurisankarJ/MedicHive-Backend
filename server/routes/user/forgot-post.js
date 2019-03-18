// User Model
const { User } = require("../../models/user.js");

const userForgotReset = async (req, res) => {
    try {
        // Get passwords from request body
        const { password, confirm } = req.body;
        // Get secret from query body
        const { secret } = req.query;

        // Check passwords
        if (password !== confirm) {
            throw new Error();
        }

        // Find and update password for user
        const user = await User.findBySecret(secret);

        // Check for user
        if (!user) {
            throw new Error(404);
        }

        // Reset password
        await user.resetPassword(password);

        // Redirect to home
        res.redirect(process.env.HOME);
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

module.exports = { userForgotReset };
