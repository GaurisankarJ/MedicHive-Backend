const userLogout = (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send("Token Deleted!");
    }, () => {
        res.status(400).send();
    });
};

module.exports = { userLogout };