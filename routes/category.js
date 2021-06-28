const { Router } = require('express');
const { check } = require('express-validator');
const { GetCategorias, GetCategoriasbyId, InsertCategoria, UpdateCategoria, DeleteCategoria } = require('../controllers/category');
const { validarCampos } = require('../middlewares/validacion');
const { validarJWT } = require('../middlewares/jwt-validacion');
const { validCategoryI, validCategorybyID, validAdminRole, validCategoryU } = require('../middlewares/db-validaciones');

const router = Router();

router.get('/', GetCategorias);

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(id => validCategorybyID(id)),
    validarCampos
], GetCategoriasbyId);

router.post('/', [
    validarJWT,
    check('name', 'El nombre de la categoría es obligatorio.').not().isEmpty(),
    check('name').custom(name => validCategoryI(name)),
    validarCampos
], InsertCategoria);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(id => validCategorybyID(id)),
    check('name', 'El nombre de la categoría es obligatorio.').not().isEmpty(),
    validCategoryU,
    validarCampos
], UpdateCategoria);

router.delete('/:id', [
    validarJWT,
    validAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(id => validCategorybyID(id)),
    validarCampos
], DeleteCategoria);

module.exports = router;
