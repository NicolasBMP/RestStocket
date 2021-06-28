let usuario = null;
let socket = null;
const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://nodejs-restserverapp.herokuapp.com/api/auth/';

const txtUid = document.getElementById('txtUid');
const txtMensaje = document.getElementById('txtMensaje');
const ulUsuarios = document.getElementById('divUsuarios');
const ulMensajes = document.getElementById('divChatbox');
const btnSalir = document.getElementById('btnSalir');

const main = async () => {
    const token = localStorage.getItem('token') || '';
    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor.');
    }
    const resp = await fetch(`${url}vjwt`, {
        headers: {
            'x-token': token,
            'Content-Type': 'application/json'
        },
        method: 'GET',
    });
    const { usuario: usuarioBD, token: Newtoken } = await resp.json();
    localStorage.setItem('token', Newtoken);
    usuario = usuarioBD;
    document.title = `Chat - ${usuario.name}`;
    conectSocket();
}

const conectSocket = () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Conectado: ' + usuario.name);
    });

    socket.on('disconnect', () => {
        console.log('Desconectado del servidor');
    });

    socket.on('recibir-mensaje', (data) => {
        mostrarMensajes(data);
    });

    socket.on('usuarios-activos', (data) => {
        mostrarUsuarios(data);
    });

    socket.on('mensaje-privado', (data) => {
        socket.removeAllListeners('mensaje-privado');
        mostrarMensajeP(data);
    });
}

const mostrarUsuarios = (usuarios = []) => {
    let usersHtml = '<li><a href="javascript:void(0)" class="active"> Chat </a></li>';
    usuarios.forEach(user => {
        if (user._id != usuario._id) {
            usersHtml += '<li>';
            usersHtml += `<a data-id="${user._id}" href="javascript:void(0)">`;
            usersHtml += `<span>${user.name}<small class="text-success">online</small></span>`;
            usersHtml += '</a>';
            usersHtml += '</li>';
        }
    });
    usersHtml += '<li class="p-20"></li>';
    ulUsuarios.innerHTML = usersHtml;
}

const mostrarMensajes = (mensajes = []) => {
    let mensajesHtml = '';
    mensajes.forEach(msj => {
        if (msj.uid == usuario._id) {
            mensajesHtml += '<li class="reverse">';
            mensajesHtml += `<div class="chat-content">`;
            mensajesHtml += `<h5>${msj.nombre}</h5>`;
            mensajesHtml += `<div class="box bg-light-inverse">${msj.mensaje}</div>`;
            mensajesHtml += `</div>`;
            mensajesHtml += '<div class="chat-img"><img src="assets/images/users/4.jpg" alt="user" /></div>';
            mensajesHtml += `<div class="chat-time">${msj.hora}</div>`;
            mensajesHtml += '</li>';
        }
        else {
            mensajesHtml += '<li>';
            mensajesHtml += '<div class="chat-img"><img src="assets/images/users/4.jpg" alt="user" /></div>';
            mensajesHtml += `<div class="chat-content">`;
            mensajesHtml += `<h5>${msj.nombre}</h5>`;
            mensajesHtml += `<div class="box bg-light-info">${msj.mensaje}</div>`;
            mensajesHtml += `</div>`;
            mensajesHtml += `<div class="chat-time">${msj.hora}</div>`;
            mensajesHtml += '</li>';
        }
    });
    ulMensajes.innerHTML = mensajesHtml;
}

const mostrarMensajeP = (mensaje) => {
    let mensajesHtml = ulMensajes.innerHTML;
    mensajesHtml += '<li>';
    mensajesHtml += '<p>';
    mensajesHtml += `<span class="text-primary">${mensaje.usuario.name}: </span>`;
    mensajesHtml += `<span>${mensaje.resp.mensaje}</span>`;
    mensajesHtml += '</p>';
    mensajesHtml += '</li>';
    ulMensajes.innerHTML = mensajesHtml;
}

txtMensaje.addEventListener('keyup', (ev) => {
    const keyCode = ev.keyCode;
    const uid = txtUid.value;
    const mensaje = txtMensaje.value;
    const fecha = new Date();
    const hora = fecha.getHours() + ':' + fecha.getMinutes();
    if (mensaje.length == 0) {
        if (keyCode == 13) {
            return;
        }
        else {

        }
    }
    /* if (mensaje.length != 0 && keyCode != 13) {
        ulMensajes.innerHTML = '<li><div class="chat-time" style="float: right;width: fit-content;margin-top: -10px;">Escribiendo...</div></li>';
    } */
    if (keyCode == 13) {
        socket.emit('enviar-mensaje', { uid, mensaje, fecha, hora });
        txtMensaje.value = '';
    }
});

btnSalir.addEventListener('click', (ev) => {
    localStorage.removeItem('token');
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut();
    console.log('Desconectado del servidor');
    socket.disconnect();
    window.location = 'index.html';
});

$('#divUsuarios').on('click', 'a', function () {
    const id = $(this).data('id');
    console.log(id);
});

(() => {
    gapi.load('auth2', () => {
        gapi.auth2.init();
        main();
    });
})();

main();
