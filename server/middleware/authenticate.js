const { User } = require("./../models/user.js");

const authenticate = async (req, res, next) => {
    try {
        // Get authentication token
        const token = req.header("x-auth");

        // Get user
        const user = await User.findByToken(token);

        // Populate req object with user and token
        req.user = user;
        req.token = token;

        // Return
        next();
    } catch (err) {
        if (err && process.env.NODE_ENV !== "test") { console.log(err); }
        // Error Unauthorized Request
        res.status(401).send();
    }
};

module.exports = { authenticate };
