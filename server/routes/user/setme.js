const _ = require("lodash");

const { UserDetails } = require("../../models/user_details.js");

const userSetMe = async (req, res) => {
    try {
        const body = _.pick(req.body, ["age", "weight", "sex", "occupation", "address"]);
        body.enteredAt = new Date().toString();
        body._creator = req.user._id;

        const userDetails = new UserDetails(body);
        await userDetails.save();

        res.send(body._creator);
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        res.status(400).send();
    }
};

module.exports = { userSetMe };
