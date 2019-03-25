// User Model
const { User } = require("../../models/user.js");

const userConfirm = async (req, res) => {
    try {
        // Get secret from query body
        const { secret } = req.query;
        // Check secret
        if (!secret) {
            throw new Error();
        }

        // Get user
        const user = await User.findBySecret(secret);
        // Check user
        if (!user) {
            throw new Error(404);
        }

        // Patch userType
        await User.findOneAndUpdate(
            { _id: user._id },
            { $set: { isActive: true } },
            { new: true }
        );

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

module.exports = { userConfirm };
