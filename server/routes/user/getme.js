const userGetMe = (req, res) => {
    res.send(req.user);
};

module.exports = { userGetMe };
