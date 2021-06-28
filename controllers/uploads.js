const { request, response } = require('express');
const { subirArchivo } = require('../helpers/subir-archivo');
const path = require('path');
const fs = require('fs');
const Usuario = require('../models/user');
const Producto = require('../models/product');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const cargarArchivo = async (req = request, res = response) => {
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];
    try {
        const Path = await subirArchivo(req.files, validExtensions, 'P06506065');
        res.status(400).json({
            msj: Path
        });
    }
    catch (error) {
        res.status(500).json({
            msj: error
        });
    }
}

const UpdateImagen = async (req = request, res = response) => {
    try {
        const { id, coleccion } = req.params;
        let modelo;
        switch (coleccion) {
            case 'users':
                modelo = await Usuario.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msj: `No existe el usuario con el ID: ${id} en la BD.`
                    });
                }
                break;

            case 'products':
                modelo = await Producto.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msj: `No existe el producto con el ID: ${id} en la BD.`
                    });
                }
                break;

            default:
                return res.status(500).json({
                    msj: 'Error en el servidor.'
                });
        }
        if (modelo.img) {
            const Path = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(Path)) {
                fs.unlinkSync(Path);
            }
        }
        const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];
        const name = await subirArchivo(req.files, validExtensions, coleccion);
        modelo.img = name;
        await modelo.save();
        res.json({
            modelo: modelo
        });
    }
    catch (error) {
        res.status(500).json({
            msj: 'Error interno - verifique los datos enviados.'
        });
    }
}

const GetImagen = async (req = request, res = response) => {
    try {
        const { id, coleccion } = req.params;
        let modelo;
        switch (coleccion) {
            case 'users':
                modelo = await Usuario.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msj: `No existe el usuario con el ID: ${id} en la BD.`
                    });
                }
                break;

            case 'products':
                modelo = await Producto.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msj: `No existe el producto con el ID: ${id} en la BD.`
                    });
                }
                break;

            default:
                return res.status(500).json({
                    msj: 'Error en el servidor.'
                });
        }
        if (modelo.img) {
            const Path = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(Path)) {
                return res.sendFile(Path);
            }
        }
        const noImagePath = path.join(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }
    catch (error) {
        res.status(500).json({
            msj: 'Error interno - verifique los datos enviados.'
        });
    }
}

const UpdateImagenCloud = async (req = request, res = response) => {
    try {
        const { id, coleccion } = req.params;
        let modelo;
        switch (coleccion) {
            case 'users':
                modelo = await Usuario.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msj: `No existe el usuario con el ID: ${id} en la BD.`
                    });
                }
                break;

            case 'products':
                modelo = await Producto.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msj: `No existe el producto con el ID: ${id} en la BD.`
                    });
                }
                break;

            default:
                return res.status(500).json({
                    msj: 'Error en el servidor.'
                });
        }
        if (modelo.img) {
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [public_id] = nombre.split('.');
            cloudinary.uploader.destroy(public_id);
        }
        const resp = await cloudinary.uploader.upload(req.files.file.tempFilePath);
        modelo.img = resp.secure_url;
        await modelo.save();
        res.json({
            modelo: modelo
        });
    }
    catch (error) {
        res.status(500).json({
            msj: error
        });
    }
}

const GetImagenCloud = async (req = request, res = response) => {
    try {
        const { id, coleccion } = req.params;
        let modelo;
        switch (coleccion) {
            case 'users':
                modelo = await Usuario.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msj: `No existe el usuario con el ID: ${id} en la BD.`
                    });
                }
                break;

            case 'products':
                modelo = await Producto.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msj: `No existe el producto con el ID: ${id} en la BD.`
                    });
                }
                break;

            default:
                return res.status(500).json({
                    msj: 'Error en el servidor.'
                });
        }
        if (modelo.img) {
            return res.redirect(modelo.img);
        }
        const noImagePath = path.join(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }
    catch (error) {
        res.status(500).json({
            msj: 'Error interno - verifique los datos enviados.'
        });
    }
}

module.exports = {
    cargarArchivo: cargarArchivo,
    UpdateImagen: UpdateImagen,
    UpdateImagenCloud: UpdateImagenCloud,
    GetImagen: GetImagen,
    GetImagenCloud: GetImagenCloud
}
