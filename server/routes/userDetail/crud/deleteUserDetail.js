// UserDetails Model
const { UserDetail } = require("../../../models/userDetail.js");

const deleteUserDetail = async (req, res) => {
    try {
        // Delete userDetails
        const userDetails = await UserDetail.deleteOne({ _creator: req.user._id });

        // Check userDetails
        if (userDetails.deletedCount !== 1) {
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

module.exports = { deleteUserDetail };
