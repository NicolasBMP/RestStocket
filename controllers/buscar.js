const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;
const Producto = require('../models/product');
const Categoria = require('../models/category');
const Usuario = require('../models/user');

const coleccionesPermitidas = [
    'users',
    'categories',
    'products',
    'roles'
];

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }
    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ estado: true }]
    });
    return res.json({
        size: usuarios.length,
        results: usuarios
    });
}

const buscarCategorias = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const categoria = await Categoria.findById(termino).populate('user', ['name', '_id']);
        return res.json({
            size: 1,
            results: (categoria) ? [categoria] : []
        });
    }
    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({
        name: regex,
        estado: true
    }).populate('user', ['name', '_id']);
    return res.json({
        size: categorias.length,
        results: categorias
    });
}

const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('user', ['name', '_id']).populate('category', ['name', '_id']);
        return res.json({
            size: 1,
            results: (producto) ? [producto] : []
        });
    }
    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({
        $or: [{ name: regex }, { descripcion: regex }],
        $and: [{ estado: true }]
    }).populate('user', ['name', '_id']).populate('category', ['name', '_id']);
    return res.json({
        size: productos.length,
        results: productos
    });
}

const buscar = (req = request, res = response) => {
    const { coleccion, termino } = req.params;
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msj: `Las colecciones permitidas son: ${coleccionesPermitidas}.`
        });
    }
    switch (coleccion) {
        case 'users':
            buscarUsuarios(termino, res);
            break;

        case 'categories':
            buscarCategorias(termino, res);
            break;

        case 'products':
            buscarProductos(termino, res);
            break;

        default:
            res.status(500).json({
                msj: 'Error Interno'
            });
            break;
    }
}

module.exports = {
    buscar: buscar
}
