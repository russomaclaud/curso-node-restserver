const { response, request } = require('express');

const usuariosGet = (req = request, res = response) => {

    const { q, nombre = 'no name', apikey, page = 1, limit } = req.query;

    res.json({
        msg: 'get API - usuariosGet',
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

const usuariosPost = (req = request, res = response) => {

    const { nombre, edad } = req.body;

    res.json({
        msg: 'post API - usuariosPost',
        nombre,
        edad
    });
}

const usuariosPut = (req = request, res = response) => {

    const { id } = req.params.id;

    res.json({
        msg: 'put API - usuariosPut',
        id
    });
}

const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = (req = request, res = response) => {
    res.json({
        msg: 'delete API - usuariosDelete'
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}