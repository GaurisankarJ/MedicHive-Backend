// UserData Model
const { UserData } = require("../../../models/userData.js");

const deleteUserData = async (req, res) => {
    try {
        // Delete userData
        const userData = await UserData.deleteOne({ _creator: req.user._id });
        // Check userData
        if (userData.deletedCount !== 1) {
            throw new Error(404);
        }

        // Send the status
        res.status(200).send();
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        // Not Found
        if (err && err.message === "404") {
            res.status(404).send();
        }
        // Error Bad Request
        res.status(400).send();
    }
};

module.exports = { deleteUserData };
