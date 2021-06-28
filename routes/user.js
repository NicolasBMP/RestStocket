const { Router } = require('express');
const { check } = require('express-validator');
const { GetUser, InsertUser, DeletetUser, UpdatetUser } = require('../controllers/user');
const { validarCampos } = require('../middlewares/validacion');
const { validarJWT } = require('../middlewares/jwt-validacion');
const { validRole, validEmail, validUser, validAdminRole } = require('../middlewares/db-validaciones');

const router = Router();

router.get('/', GetUser);

router.post('/', [
    check('name', 'El nombre no es válido.').not().isEmpty(),
    check('password', 'La contraseña no es válida.').isLength({ min: 8 }),
    check('email').custom(email => validEmail(email)),
    check('role').custom(role => validRole(role)),
    //check('role', 'El rol no existe.').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos
], InsertUser);

router.delete('/:id', [
    validarJWT,
    validAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(id => validUser(id)),
    validarCampos
], DeletetUser);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(id => validUser(id)),
    check('role').custom(role => validRole(role)),
    validarCampos
], UpdatetUser);

module.exports = router;
