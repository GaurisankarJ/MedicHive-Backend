const userLogout = async (req, res) => {
    try {
        await req.user.removeToken(req.token);

        res.send("Successfully logged out!");
    } catch (err) {
        if (process.env.NODE_ENV !== "test") { console.log(err); }
        res.status(400).send();
    }
};

module.exports = { userLogout };
