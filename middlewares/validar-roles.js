const { response } = require("express");



const esAdminRole = (req, res = response, next) => {

    // validación solo para asegurarnos que estamos llamando correctamente este ADMIN_ROLE
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se está verificando el role sin validar el token primero'
        });
    }

    const { rol, nombre } = req.usuario;
    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} No es Administrador - No tiene permiso`
        })
    }

    next();
}

const tieneRole = (...roles) => {

    return (req, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se está verificando el role sin validar el token primero'
            });
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        }

        next();
    }

}

module.exports = {
    esAdminRole,
    tieneRole
}