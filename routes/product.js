const { Router } = require('express');
const { check } = require('express-validator');
const { GetProductos, GetProductobyId, InsertProducto, UpdateProducto, DeleteProducto } = require('../controllers/product');
const { validarCampos } = require('../middlewares/validacion');
const { validarJWT } = require('../middlewares/jwt-validacion');
const { validAdminRole, validProductbyID, validProductI, validCategorybyID, validProductU } = require('../middlewares/db-validaciones');

const router = Router();

router.get('/', GetProductos);

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(id => validProductbyID(id)),
    validarCampos
], GetProductobyId);

router.post('/', [
    validarJWT,
    check('name', 'El nombre del producto es obligatorio.').not().isEmpty(),
    check('name').custom(name => validProductI(name)),
    check('category', 'El ID de la categoría no es válido').isMongoId(),
    check('category').custom(id => validCategorybyID(id)),
    validarCampos
], InsertProducto);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(id => validProductbyID(id)),
    validProductU,
    validarCampos
], UpdateProducto);

router.delete('/:id', [
    validarJWT,
    validAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(id => validProductbyID(id)),
    validarCampos
], DeleteProducto);

module.exports = router;
