const { response } = require("express");
const { Producto } = require("../models");

// obtenerProductos - paginado - total - populate
const obtenerProductos = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = ({ estado: true });

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });

}

// obtenerProducto - populate
const obtenerProducto = async (req, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')

    res.json(producto);
}



const crearProducto = async (req, res = response) => {

    // Leemos todo lo que viene en el body e ignoramos estado y usuario
    const { estado, usuario, ...body } = req.body;

    // Verificamos si existe una categoria con ese nombre
    const productoDB = await Producto.findOne({ nombre: body.nombre });

    // Sí existe mandamos un error
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    }

    // Crea y prepara
    const producto = new Producto(data);

    // Guarda en BD
    await producto.save();

    // Hacemos la impresión - Enviamos el status(201) de creado OK!
    res.status(201).json(producto);
}

// actualizarCategoria
const actualizarProducto = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json(producto);

}

// borrarCategoria - estado: false
const borrarProducto = async (req, res = response) => {

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(200).json(productoBorrado);


}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
}