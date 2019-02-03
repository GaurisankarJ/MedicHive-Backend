const documentDownload = (req, res) => {
    res.send({
        name: req.file.originalname
    });
};

module.exports = { documentDownload };