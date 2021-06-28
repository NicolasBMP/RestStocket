const { v4: uuidv4 } = require('uuid');
const path = require('path');

const subirArchivo = (files, validExtensions = [], carpeta = '') => {
    return new Promise((resolve, reject) => {
        const { file } = files;
        const names = file.name.split('.');
        const extension = names[names.length - 1];
        if (validExtensions.length > 0 && !validExtensions.includes(extension)) {
            return reject(`La extensión ${extension} no es válida.`);
        }
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
        file.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }
            resolve(nombreTemp);
        });
    });
}

module.exports = {
    subirArchivo: subirArchivo
}
