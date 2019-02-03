const documentUpload = (req, res) => {
    res.send({
        name: req.file.originalname
    });
};

module.exports = { documentUpload };