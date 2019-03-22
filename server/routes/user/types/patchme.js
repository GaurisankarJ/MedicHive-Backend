// Lodash
const _ = require("lodash");

// UserDetails Model
const { UserDetails } = require("../../../models/user-details.js");

const userPatchMe = async (req, res) => {
    try {
        // Get userType
        const { userType } = req.user;

        // Get key, value from request body
        const { key, value } = req.body;

        // Check key and value
        if (!key || !value) {
            throw new Error();
        }

        // Common keys
        const keys = ["name", "address"];

        // Find userDetails
        const userDetails = await UserDetails.findOne({ _creator: req.user._id });
        // Check userDetails
        if (!userDetails) {
            throw new Error(404);
        }

        // Check userType
        if (userType === "s") {
            // Seller key
            const sellerKeys = ["age", "weight", "sex", "occupation"];
            // Check key against common and seller keys
            if (_.indexOf(keys, key) < 0 && _.indexOf(sellerKeys, key) < 0) {
                throw new Error();
            } else if (_.indexOf(keys, key) >= 0) {
                // Update the userDetails body
                userDetails[key] = value;
            } else if (_.indexOf(sellerKeys, key) >= 0) {
                // Update the userDetails.sellers body
                userDetails.seller[key] = value;
            }

            // Patch userDetails
            await UserDetails.findOneAndUpdate(
                { _creator: req.user._id },
                { $set: userDetails },
                { new: true }
            );

            // Send JSON body
            res.json({ message: `${key} updated`, email: req.user.email });
        } else if (userType === "b" || userType === "v") {
            // Check key against common and seller keys
            if (_.indexOf(keys, key) < 0) {
                throw new Error();
            } else {
                // Update the userDetails body
                userDetails[key] = value;
            }

            // Patch userDetails
            await UserDetails.findOneAndUpdate(
                { _creator: req.user._id },
                { $set: userDetails },
                { new: true }
            );

            // Send JSON body
            res.json({ message: `${key} updated`, email: req.user.email });
        }
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

module.exports = { userPatchMe };
