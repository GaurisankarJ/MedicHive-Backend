// UserDetails Model
const { UserDetails } = require("../../../models/user-details.js");

const userGetMe = async (req, res) => {
    try {
        // Get userDetails
        const userDetails = await UserDetails.findOne({ _creator: req.user._id });
        // Check userDetails
        if (!userDetails) {
            throw new Error(404);
        }

        // Send JSON body
        res.send({ userType: req.user.userType, userDetails });
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

module.exports = { userGetMe };
