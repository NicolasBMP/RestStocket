const { Schema, model } = require('mongoose');

const productSchema = Schema({
    name: {
        type: String,
        required: [true, 'Nombre obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    precio: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Categorie',
        require: true
    },
    descripcion: {
        type: String,
        default: ''
    },
    disponible: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    }
});

productSchema.methods.toJSON = function () {
    const { __v, ...rest } = this.toObject();
    return rest;
}

module.exports = model('Product', productSchema);
