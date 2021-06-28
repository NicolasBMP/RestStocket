const jwt = require('jsonwebtoken');

const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, process.env.JWTKEY, {
            expiresIn: '1d'
        }, (error, token) => {
            if (error) {
                console.log(err);
                reject('No se pudo generar el token.');
            }
            else {
                resolve(token);
            }
        });
    });
}

module.exports = {
    generarJWT: generarJWT
}
