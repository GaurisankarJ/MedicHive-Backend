// User Model
const { User } = require("../../models/user.js");

const userDelete = async (req, res) => {
    try {
        // Delete user
        await User.deleteOne({ _id: req.user._id });

        // Send the status
        res.status(200).send();
    } catch (err) {
        if (err && process.env.NODE_ENV !== "test") { console.log(err); }
        // Error Bad Request
        res.status(400).send();
    }
};

module.exports = { userDelete };
