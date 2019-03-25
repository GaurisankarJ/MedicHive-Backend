// User Model
const { User } = require("../../../models/user.js");

const patchUser = async (req, res) => {
    try {
        // Get key, value from request body
        const { key, value } = req.body;
        // Check key and value
        if (!key || !value) {
            throw new Error();
        }

        // Check email or password to patch
        if (key === "email") {
            // Check user email same as value
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
            // Check user password same as value
            const check = await User.findByCredentials(req.user.email, value);
            if (check) {
                throw new Error();
            }

            // Patch password
            const user = await User.findOneAndUpdate(
                { _id: req.user._id },
                { $set: { password: value } },
                { new: true }
            );

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

module.exports = { patchUser };
