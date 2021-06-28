const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generarJWT } = require('../middlewares/generar-jwt');
const { OAuth2Client } = require('google-auth-library');

const Login = async (req, res = response) => {
    try {
        const { email, password } = req.body;
        const usuario = await User.findOne({ email: email });
        if (!usuario) {
            return res.status(400).json({
                msj: 'Usuario no existe en la BD.'
            });
        }
        if (!usuario.estado) {
            return res.status(400).json({
                msj: 'El usuario esta inhabilitado.'
            });
        }
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msj: 'Usuario y/o constraseña incorrectos.'
            });
        }
        const token = await generarJWT(usuario.id);
        res.json({
            msj: 'Login OK.',
            token
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msj: '500 - Error interno'
        });
    }
}

const googleSigin = async (req = request, res = response) => {
    try {
        const { id_token } = req.body;
        const client = new OAuth2Client(process.env.GOOGLECLIENTID);
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLECLIENTID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const data = {
            name: payload.name,
            email: payload.email,
            password: 'undefined',
            google: true
            /*img: payload.picture*/
        }
        let usuario = await User.findOne({ email: payload.email });
        if (!usuario) {
            usuario = new User(data);
            await usuario.save();
        }
        if (!usuario.estado) {
            return res.status(400).json({
                msj: 'El usuario esta inhabilitado.'
            });
        }
        const token = await generarJWT(usuario.id);
        res.json({
            msj: 'Google sigin OK',
            data,
            token
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            msj: 'Token de Google no validado'
        });
    }
}

const renovarJWT = async (req = request, res = response) => {
    const usuario = req.AU;
    const token = await generarJWT(usuario.id);
    res.json({
        usuario,
        token
    });
}

module.exports = {
    Login: Login,
    googleSigin: googleSigin,
    renovarJWT: renovarJWT
}
