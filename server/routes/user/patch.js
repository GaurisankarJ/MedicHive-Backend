// User Model
const { User } = require("../../models/user.js");

const userPatch = async (req, res) => {
    try {
        // Get update parameters from request body
        const { field, update } = req.body;

        // Check if email or password to update
        if (field === "email") {
            // Check if user email is same as update
            if (req.user.email === update) {
                throw new Error();
            }

            // Patch email
            const user = await User.findOneAndUpdate(
                { _id: req.user._id },
                { $set: { email: update } },
                { new: true }
            );

            // Send JSON body
            res.json({ message: "username reset", email: user.email });
        } else if (field === "password") {
            // Check if user password is same as update
            const check = await User.findByCredentials(req.user.email, update);
            if (check) {
                throw new Error();
            }

            // Patch password
            const user = await req.user.resetPassword(update);

            // Send JSON body
            res.json({ message: "password reset", email: user.email });
        }
    } catch (err) {
        if (err && process.env.NODE_ENV !== "test") { console.log(err); }
        // Error Bad Request
        res.status(400).send();
    }
};

module.exports = { userPatch };
