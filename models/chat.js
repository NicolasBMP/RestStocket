class Mensaje {
    constructor(uid, nombre, mensaje, fecha, hora) {
        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje;
        this.fecha = fecha;
        this.hora = hora;
    }
}

class Chat {
    constructor() {
        this.mensajes = [];
        this.usuarios = {};
    }

    get ultimosMensajes() {
        this.mensajes = this.mensajes.splice(0, 10);
        return this.mensajes;
    }

    get usuariosArr() {
        return Object.values(this.usuarios);
    }

    enviarMensaje(uid, nombre, mensaje, fecha, hora) {
        this.mensajes.push(new Mensaje(uid, nombre, mensaje, fecha, hora));
    }

    conectarUsuario(usuario) {
        this.usuarios[usuario.id] = usuario;
    }

    desconectarUsuario(usuario) {
        delete this.usuarios[usuario.id];
    }
}

module.exports = Chat;
