const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");



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

const googleSignin = async (req, res = response) => {

    const { id_token } = req.body;

    try {

        const { nombre, img, correo } = await googleVerify(id_token);

        // Generar la referencia para ver sí las credenciales existen en la BD 
        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            // Sí el usuario no existe tengo que crearlo
            const data = {
                nombre,
                correo,
                password: '😜',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Sí el usuario en BD tiene su autenticación en false negamos su ingreso
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Hable con el administrador, Usuario bloqueado'
            });
        }

        // Generar el JWT (json web token)
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        });

    } catch (error) {

        res.status(400).json({
            msg: 'El token de Google no es válido'
        });

    }


}

module.exports = {
    login,
    googleSignin
}