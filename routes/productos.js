const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto, } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

// {{url}}/api/categorias

// Obtener todas las productos - publico
router.get('/', obtenerProductos);

// Obtener un producto por ID - publico
router.get('/:id', [
    check('id', 'No es un ID de mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], obtenerProducto);

// Crear producto - privado - cualquier persona con un token válido - ADMIN_ROLE
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de mongo válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos,
], crearProducto);

// Actualizar producto por ID - privado - cualquier persona con un token válido - ADMIN_ROLE
router.put('/:id', [
    validarJWT,
    // check('categoria', 'No es un ID de mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], actualizarProducto);

// Borrando categoria por ID - privado - cualquier persona con un token válido - ADMIN_ROLE
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID de mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], borrarProducto);


module.exports = router;