// UserData Model
const { UserData } = require("../../models/userData.js");

const getMessage = async (req, res) => {
    try {
        // Get userData
        const userData = await UserData.findOne({ _creator: req.user._id });
        // Check userData
        if (!userData) {
            throw new Error(404);
        }

        // Send JSON body
        res.send({ sent: userData.message.sent, received: userData.message.received, email: req.user.email });
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

module.exports = { getMessage };
