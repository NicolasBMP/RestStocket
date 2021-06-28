const { response, request } = require('express');
const Producto = require('../models/product');

const GetProductos = async (req = request, res = response) => {
    const { limit = 15, from = 0 } = req.query;
    const query = { estado: true };
    const productos = await Producto.find(query).skip(Number(from)).limit(Number(limit)).populate('user', ['name', '_id']).populate('category', ['name', '_id']);
    res.json({
        size: productos.length,
        productos: productos
    });
}

const GetProductobyId = async (req = request, res = response) => {
    const { id } = req.params;
    const productos = await Producto.findById(id).populate('user', ['name', '_id']).populate('category', ['name', '_id']);
    res.json({
        productos
    });
}

const InsertProducto = async (req = request, res = response) => {
    const data = req.body;
    data.user = req.AU._id;
    const producto = new Producto(data);
    await producto.save();
    res.status(201).json({
        msj: 'POST - Producto',
        producto
    });
}

const UpdateProducto = async (req, res = response) => {
    const { id } = req.params;
    const { user, ...rest } = req.body;
    const producto = await Producto.findByIdAndUpdate(id, rest, { new: true });
    res.json({
        msj: 'PUT - Producto',
        producto
    });
}

const DeleteProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });
    res.json({
        msj: 'DELETE - Producto',
        producto
    });
}

module.exports = {
    GetProductos: GetProductos,
    GetProductobyId: GetProductobyId,
    InsertProducto: InsertProducto,
    UpdateProducto: UpdateProducto,
    DeleteProducto: DeleteProducto
}
