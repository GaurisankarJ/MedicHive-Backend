// Lodash
const _ = require("lodash");

// User Model
const { User } = require("../../../models/user.js");

const getUser = async (req, res) => {
    try {
        // Get userType from query body
        const { userType } = req.query;
        // Check userType
        if (!userType || !/[sbv]/i.test(userType)) {
            throw new Error();
        }

        // Get users
        const users = await User.find({ userType });
        // Check users
        if (_.isEmpty(users)) {
            throw new Error(404);
        }

        // Send JSON body
        res.send({ users });
    } catch (err) {
        if (err && process.env.NODE_ENV !== "test") { console.log(err); }
        // Not Found
        if (err && err.message === "404") {
            res.status(404).send();
        }
        // Error Bad Request
        res.status(400).send();
    }
};

module.exports = { getUser };
