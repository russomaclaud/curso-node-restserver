const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");



const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar sí el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario y Password incorrectos - correo'
            });
        }

        // Sí el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario y Password incorrectos - estado: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario y Password incorrectos - password'
            });
        }

        // Generar el JWT (json web token)
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salio mal Hablar con el administrador'
        });
    }


}

module.exports = {
    login
}