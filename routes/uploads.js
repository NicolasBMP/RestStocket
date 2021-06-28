const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, UpdateImagen, GetImagen, UpdateImagenCloud, GetImagenCloud } = require('../controllers/uploads');
const { coleccionPermitida } = require('../middlewares/db-validaciones');
const { validarCampos } = require('../middlewares/validacion');
const { validFiles } = require('../helpers/validar-archivo')

const router = Router();

router.post('/', validFiles, cargarArchivo);

router.put('/:coleccion/:id', [
    validFiles,
    check('id', 'El ID no es válido.').isMongoId(),
    check('coleccion').custom(c => coleccionPermitida(c, ['users', 'products'])),
    validarCampos
], UpdateImagenCloud);

router.get('/:coleccion/:id', [
    check('id', 'El ID no es válido.').isMongoId(),
    check('coleccion').custom(c => coleccionPermitida(c, ['users', 'products'])),
    validarCampos
], GetImagenCloud);

module.exports = router;
