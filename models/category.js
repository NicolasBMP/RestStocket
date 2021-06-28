const { Schema, model } = require('mongoose');

const categorySchema = Schema({
    name: {
        type: String,
        required: [true, 'Nombre obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        require: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
});

categorySchema.methods.toJSON = function () {
    const { __v, ...rest } = this.toObject();
    return rest;
}

module.exports = model('Categorie', categorySchema);
