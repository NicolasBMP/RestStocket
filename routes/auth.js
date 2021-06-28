const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validacion');
const { validarJWT } = require('../middlewares/jwt-validacion');
const { Login, googleSigin, renovarJWT } = require('../controllers/auth');

const router = Router();

router.post('/login', [
    check('email', 'El correo no es válido.').isEmail(),
    check('password', 'La contraseña no es válida').not().isEmpty(),
    validarCampos
], Login);

router.post('/google', [
    check('id_token', 'El id_token es obligatorio.').not().isEmpty(),
    validarCampos
], googleSigin);

router.get('/vjwt', validarJWT, renovarJWT);

module.exports = router;
