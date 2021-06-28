const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MDBCONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('Database up');
    }
    catch (error) {
        console.log(error);
        throw new Error('Error en la instancia de la BD');
    }
}

module.exports = {
    dbConnection: dbConnection
}
