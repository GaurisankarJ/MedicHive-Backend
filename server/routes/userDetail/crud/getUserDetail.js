// UserDetails Model
const { UserDetail } = require("../../../models/userDetail.js");

const getUserDetail = async (req, res) => {
    try {
        // Get userDetails
        const userDetail = await UserDetail.findOne({ _creator: req.user._id });
        // Check userDetails
        if (!userDetail) {
            throw new Error(404);
        }

        // Send JSON body
        res.send({ userType: req.user.userType, userDetail });
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

module.exports = { getUserDetail };
