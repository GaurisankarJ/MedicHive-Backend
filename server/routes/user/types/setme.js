// Lodash
const _ = require("lodash");

// UserDetails Model
const { UserDetails } = require("../../../models/user-details.js");

const userSetMe = async (req, res) => {
    try {
        // Get userType
        const { userType } = req.user;

        // Check name and address
        if (!req.body.name || !req.body.address) {
            throw new Error();
        }

        // Check userType
        if (userType === "s") {
            // Create body object from request body
            const body = _.pick(req.body, ["name", "address", "seller"]);
            body._creator = req.user._id;

            // Seller fields
            const seller = ["age", "weight", "sex", "occupation"];

            // Check seller
            if (_.difference(Object.keys(body.seller), seller).length !== 0) {
                throw new Error();
            }

            // Create an instance of UserDetails model
            const userDetails = new UserDetails(body);
            // Save the userDetails instance
            await userDetails.save();

            // Send JSON body
            res.json({ message: "user created", email: req.user.email });
        } else if (userType === "b" || userType === "v") {
            // Create body object from request body
            const body = _.pick(req.body, ["name", "address"]);
            body._creator = req.user._id;

            // Create an instance of UserDetails model
            const userDetails = new UserDetails(body);
            // Save the userDetails instance
            await userDetails.save();

            // Send JSON body
            res.json({ message: "user created", email: req.user.email });
        }
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        // Error Bad Request
        res.status(400).send();
    }
};

module.exports = { userSetMe };
