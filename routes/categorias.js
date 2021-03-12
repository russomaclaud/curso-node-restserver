const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria, } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

// {{url}}/api/categorias

// Obtener todas las catgorias - publico
router.get('/', obtenerCategorias);

// Obtener una catgoria por ID - publico
router.get('/:id', [
    check('id', 'No es un ID de mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
], obtenerCategoria);

// Crear categoria - privado - cualquier persona con un token válido - ADMIN_ROLE
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], crearCategoria);

// Actualizar categoria por ID - privado - cualquier persona con un token válido - ADMIN_ROLE
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
], actualizarCategoria);

// Borrando categoria por ID - privado - cualquier persona con un token válido - ADMIN_ROLE
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID de mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
], borrarCategoria);


module.exports = router;