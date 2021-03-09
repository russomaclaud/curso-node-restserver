const { Router } = require('express');
const { check } = require('express-validator');

const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('password', 'El password debe contener más de 6 caracteres').isLength({ min: 6 }),
    validarCampos
], login);

module.exports = router;