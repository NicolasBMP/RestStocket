const { validarJWTSocket } = require('../middlewares/jwt-validacion');
const Chat = require('../models/chat');

const chat = new Chat();

const socketController = async (socket, io) => {
    console.log('Connected', socket.id);
    const token = socket.handshake.headers['x-token'];
    const usuario = await validarJWTSocket(token);
    if (!usuario) {
        return socket.disconnect();
    }
    chat.conectarUsuario(usuario);
    io.emit('usuarios-activos', chat.usuariosArr);
    socket.emit('recibir-mensaje', chat.ultimosMensajes);
    socket.join(usuario.id);
    socket.on('disconnect', () => {
        chat.desconectarUsuario(usuario);
        io.emit('usuarios-activos', chat.usuariosArr);
    });
    socket.on('enviar-mensaje', resp => {
        if (resp.uid) {
            socket.to(resp.uid).emit('mensaje-privado', { usuario, resp });
        }
        else {
            chat.enviarMensaje(usuario.id, usuario.name, resp.mensaje, resp.fecha, resp.hora);
            io.emit('recibir-mensaje', chat.ultimosMensajes);
        }
    });
}

module.exports = {
    socketController: socketController
}
