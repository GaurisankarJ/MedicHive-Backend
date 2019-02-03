const getDocuments = (req, res) => {
    res.send({
        name: req.file.originalname
    });
};

module.exports = { getDocuments };