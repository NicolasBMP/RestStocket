const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const GetUser = async (req, res = response) => {
    const { limit = 15, from = 0 } = req.query;
    const query = { estado: true };
    const usuarios = await User.find(query).skip(Number(from)).limit(Number(limit));
    //AUX
    /* const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query).skip(Number(from)).limit(Number(limit))
    ]); */
    res.json({
        size: usuarios.length,
        usuarios: usuarios
    });
}

const InsertUser = async (req = request, res = response) => {
    const { name, email, password, role } = req.body;
    const user = new User({
        name,
        email,
        password,
        role
    });
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);
    await user.save();
    return res.json({
        msj: 'POST - From controller'
    });
}

const DeletetUser = async (req, res = response) => {
    const { id } = req.params;
    //Fisicamente
    //const user = await User.findByIdAndDelete(id);
    //Actualizar estado
    const user = await User.findByIdAndUpdate(id, { estado: false });
    res.json({
        msj: 'DELETE - From controller',
        user
    });
}

const UpdatetUser = async (req = request, res = response) => {
    const { id } = req.params;
    const { password, google, email, ...rest } = req.body;
    if (password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }
    const user = await User.findByIdAndUpdate(id, rest);
    //Añadir campos en la actualizacion para la coleccion
    //const user = await User.findByIdAndUpdate(id, { $set: { rest } });
    //Agregar data a arrays dentro de una coleccion
    //const user = await User.findByIdAndUpdate(id, { $push: { rest } });
    //Quitar data a arrays dentro de una coleccion
    //const user = await User.findByIdAndUpdate(id, { $unset: { "(coleccion).(posicion).(coleccion-interna):" '' } });
    //query de colecciones internas
    //const user = await User.find({ "(coleccion).(coleccion-interna):" 'FILTRO' }});
    //const user = await User.find({ "(coleccion):" { $elementMatch: { "dato": { $gt: 50 } } } });
    //Actualizacion masiva
    //const user = await User.findByIdAndUpdate(id, rest, { multi: true });
    //const user = await User.findAndUpdate({"FILTRO"}, {$set: {"campo": data}}, { multi: true });
    //No mostrar atributos
    //const usuarios = await User.find(query, { "_id": 0(no)1(si) }).skip(Number(from)).limit(Number(limit));
    //Reemplazar estructura o datos y si no lo encuentra, lo registra
    //const user = await User.findByIdAndUpdate(id, rest, { upsert: true });
    //in y nin (esta o no un dato en un arreglo)
    //const user = await User.find({ "dato": {$in: ["ARREGLO"] } });
    //and/or
    //const user = await User.find({ $and/$or: [{"dato", {"FILTRO"}] });
    //not(elemento) /nor (arreglo)
    //const user = await User.find({ "dato": { $not: {$lte: 20} }});
    //const user = await User.find({$nor: ["FILTROS"] });
    //exists
    //const user = await User.find({ "dato": { $exists: true, ... (mas operaciones) }});
    //type
    //const user = await User.find({ "dato": { $type: "double" }});
    //all
    //const user = await User.find({ "dato-array": { $all: ["dato1", "dato2"] }});
    //const user = await User.find({ $and: [{ "dato-array": "dato1" }, { "dato-array": "dato2" }] });
    //sort (1 = ascendente/-1 = descendente)
    //const user = await User.find().sort({"dato": 1/-1});
    //expr
    //const user = await User.find({$expr: { $gt(condicional): ["campo", "campo/dato"] }});
    //unset (eliminar un campo)
    //const user = await User.find({FILTRO}, {$unset: {"campo":""}});
    //rename (cambiar de nombre a un campo)
    //const user = await User.find({FILTRO}, {$rename: {"campo":"campo2"}});
    //min, max y mul
    //const user = await User.findByIdAndUpdate(id, { $min: {dato: valor} }); (valor < dato)
    //agrupar
    /*const user = await User.aggregate([{
        { $group: {_id: {nombre_campo: "$campoMongo"}, nueva_data: {$sum: "otrocampo" } } }
    }]);*/
    res.json({
        msj: 'PUT - From controller',
        user
    });
}

module.exports = {
    GetUser: GetUser,
    InsertUser: InsertUser,
    DeletetUser: DeletetUser,
    UpdatetUser: UpdatetUser
}
