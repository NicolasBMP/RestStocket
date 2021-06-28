const { request, response } = require('express');

const validFiles = (req = request, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(401).json({
            msj: 'No hay archivos en la petición.'
        });
    }
    next();
}

module.exports = {
    validFiles: validFiles
}
