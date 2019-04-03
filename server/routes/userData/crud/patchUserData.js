// Lodash
const _ = require("lodash");

// UserData Model
const { UserData } = require("../../../models/userData.js");

const patchUserData = async (req, res) => {
    try {
        // Get key, value from request body
        const { key, value } = req.body;
        // Common keys
        const keys = ["name", "address"];
        // Seller keys
        const sellerKeys = ["age", "weight", "sex", "occupation"];
        // Check key and value
        if (!key || (_.indexOf(keys, key) < 0 && _.indexOf(sellerKeys, key) < 0) || !value) {
            throw new Error();
        }

        // Get userType
        const { userType } = req.user;

        // Get userData
        const userData = await UserData.findOne({ _creator: req.user._id });
        // Check userData
        if (!userData) {
            throw new Error(404);
        }

        // Check userType to patch
        if (userType === "s") {
            // Check key to patch (against common, seller keys)
            if (_.indexOf(keys, key) >= 0) {
                // Update the userData body
                userData[key] = value;
            } else if (_.indexOf(sellerKeys, key) >= 0) {
                // Update the userData.sellers body
                userData.seller[key] = value;
            } else {
                throw new Error();
            }

            // Patch userData
            await UserData.updateOne(
                { _creator: req.user._id },
                { $set: userData }
            );
        } else if (userType === "b" || userType === "v") {
            // Check key to patch (against common keys)
            if (_.indexOf(keys, key) >= 0) {
                // Update the userData body
                userData[key] = value;
            } else {
                throw new Error();
            }

            // Patch userData
            await UserData.updateOne(
                { _creator: req.user._id },
                { $set: userData }
            );
        }

        // Send JSON body
        res.json({ message: `${key} updated`, email: req.user.email });
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

module.exports = { patchUserData };
