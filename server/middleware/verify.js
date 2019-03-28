const verify = async (req, res, next) => {
    try {
        // Check isActive
        if (!req.user.isActive) {
            throw new Error();
        }

        // Return
        next();
    } catch (err) {
        if (err && process.env.NODE_ENV !== "test") { console.log(err); }
        // Error Unauthorized Request
        res.status(401).send();
    }
};

module.exports = { verify };
