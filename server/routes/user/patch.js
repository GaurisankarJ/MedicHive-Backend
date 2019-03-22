// User Model
const { User } = require("../../models/user.js");

const userPatch = async (req, res) => {
    try {
        // Get key, value from request body
        const { key, value } = req.body;

        // Check key and value
        if (!key || !value) {
            throw new Error();
        }

        // Check if email or password to patch
        if (key === "email") {
            // Check if user email is same as value
            if (req.user.email === value) {
                throw new Error();
            }

            // Patch email
            const user = await User.findOneAndUpdate(
                { _id: req.user._id },
                { $set: { email: value } },
                { new: true }
            );

            // Send JSON body
            res.json({ message: `${key} reset`, email: user.email });
        } else if (key === "password") {
            // Check if user password is same as value
            const check = await User.findByCredentials(req.user.email, value);
            if (check) {
                throw new Error();
            }

            // Patch password
            const user = await req.user.resetPassword(value);

            // Send JSON body
            res.json({ message: `${key} reset`, email: user.email });
        } else {
            throw new Error();
        }
    } catch (err) {
        if (err && process.env.NODE_ENV !== "test") { console.log(err); }
        // Error Bad Request
        res.status(400).send();
    }
};

module.exports = { userPatch };
