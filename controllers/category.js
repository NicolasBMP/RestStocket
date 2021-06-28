const { response, request } = require('express');
const Categoria = require('../models/category');

const GetCategorias = async (req = request, res = response) => {
    const { limit = 15, from = 0 } = req.query;
    const query = { estado: true };
    const categorias = await Categoria.find(query).skip(Number(from)).limit(Number(limit)).populate('user', ['name', '_id']);
    res.json({
        size: categorias.length,
        categorias: categorias
    });
}

const GetCategoriasbyId = async (req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('user', ['name', '_id']);
    res.json({
        categoria
    });
}

const InsertCategoria = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase();
    const data = {
        name,
        user: req.AU._id
    };
    const categoria = new Categoria(data);
    await categoria.save();
    res.status(201).json({
        msj: 'POST - Categoria',
        categoria
    });
}

const UpdateCategoria = async (req, res = response) => {
    const { id } = req.params;
    const { user, ...rest } = req.body;
    rest.name = rest.name.toUpperCase();
    const categoria = await Categoria.findByIdAndUpdate(id, rest, { new: true });
    res.json({
        msj: 'PUT - Categoria',
        categoria
    });
}

const DeleteCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });
    res.json({
        msj: 'DELETE - Categoria',
        categoria
    });
}

module.exports = {
    GetCategorias: GetCategorias,
    GetCategoriasbyId: GetCategoriasbyId,
    InsertCategoria: InsertCategoria,
    UpdateCategoria: UpdateCategoria,
    DeleteCategoria: DeleteCategoria
}
