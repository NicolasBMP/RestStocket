const Role = require('../models/role');
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');
const { response, request } = require('express');

const validRole = async (role = '') => {
    const existerol = await Role.findOne({ rol: role });
    if (!existerol) {
        throw new Error(`No existe el rol: ${role} en la BD.`);
    }
}

const validEmail = async (email = '') => {
    const existsemail = await User.findOne({ email: email });
    if (existsemail) {
        throw new Error(`El correo: ${email} ya existe en la BD.`);
    }
}

const validUser = async (id) => {
    const existeusuario = await User.findById(id);
    if (!existeusuario) {
        throw new Error(`No existe el usuario con el ID: ${id} en la BD.`);
    }
}

const validAdminRole = (req = request, res = response, next) => {
    console.log(req.AU);
    if (!req.AU) {
        return res.status(500).json({
            msj: 'No existe el usuario autenticado con el token.'
        });
    }
    else {
        const { role, name } = req.AU;
        if (role != 'ADMIN_ROLE') {
            return res.status(401).json({
                msj: `${name} no es un administrador.`
            });
        }
    }
    next();
}

const validCategoryI = async (name = '') => {
    const existecategoria = await Category.findOne({ name: name.toUpperCase() });
    if (existecategoria) {
        throw new Error(`Ya existe la categoría: ${name} en la BD.`);
    }
}

const validCategoryU = async (req = request, res = response, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const existecategoria = await Category.findOne({ name: name.toUpperCase(), _id: { $ne: id } });
    if (existecategoria) {
        return res.status(401).json({
            msj: `Ya existe la categoría: ${name} en la BD.`
        });
    }
    next();
}

const validCategorybyID = async (id) => {
    const existecategoria = await Category.findById(id);
    if (!existecategoria) {
        throw new Error(`No existe la categoría con el ID: ${id} en la BD.`);
    }
}

const validProductI = async (name = '') => {
    const existeproducto = await Product.findOne({ name: name });
    if (existeproducto) {
        throw new Error(`Ya existe el producto: ${name} en la BD.`);
    }
}

const validProductU = async (req = request, res = response, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const existeproducto = await Product.findOne({
        name: name.toUpperCase(),
        _id: { $ne: id }
    });
    if (existeproducto) {
        return res.status(401).json({
            msj: `Ya existe el producto: ${name} en la BD.`
        });
    }
    next();
}

const validProductbyID = async (id) => {
    const existeproducto = await Product.findById(id);
    if (!existeproducto) {
        throw new Error(`No existe el producto con el ID: ${id} en la BD.`);
    }
}

const coleccionPermitida = (coleccion = '', colecciones = []) => {
    const existecoleccion = colecciones.includes(coleccion);
    if (!existecoleccion) {
        throw new Error(`La coleccion: ${coleccion} no es permitida.`);
    }
    return true;
}

module.exports = {
    validRole: validRole,
    validEmail: validEmail,
    validUser: validUser,
    validAdminRole: validAdminRole,
    validCategoryI: validCategoryI,
    validCategoryU: validCategoryU,
    validCategorybyID: validCategorybyID,
    validProductbyID: validProductbyID,
    validProductI: validProductI,
    validProductU: validProductU,
    coleccionPermitida: coleccionPermitida
}
