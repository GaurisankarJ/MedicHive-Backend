// User Model
const { User } = require("../../../models/user.js");

const deleteUser = async (req, res) => {
    try {
        // Delete user
        const user = await User.deleteOne({ _id: req.user._id });
        // Check user
        if (user.deletedCount !== 1) {
            throw new Error(404);
        }

        // Send the status
        res.status(200).send();
    } catch (err) {
        if (err && process.env.NODE_ENV !== "test") { console.log(err); }
        // Error Bad Request
        res.status(400).send();
    }
};

module.exports = { deleteUser };
