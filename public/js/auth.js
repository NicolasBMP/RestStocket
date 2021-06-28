const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://nodejs-restserverapp.herokuapp.com/api/auth/';

const formulario = document.querySelector('form');

formulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};
    for (let el of formulario.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }
    fetch(url + 'login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    }).then(resp => resp.json()).then(data => {
        if (!data.msj.includes('OK')) {
            console.log(data.msj);
        }
        else {
            localStorage.setItem('token', data.token);
            window.location = 'chat.html';
        }
    });
});


function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //console.log('Name: ' + profile.getName());
    //console.log('Image URL: ' + profile.getImageUrl());
    //console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    var id_token = googleUser.getAuthResponse().id_token;
    const gtoken = { id_token };
    fetch(url + 'google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gtoken)
    }).then(resp => resp.json()).then(data => {
        const token = data.token;
        console.log(token);
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    }).catch(error => console.log(error));
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}
