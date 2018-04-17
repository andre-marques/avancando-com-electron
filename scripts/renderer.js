const path       = require('path');
const Mousetrap  = require('mousetrap');
const { remote } = require('electron');
const mainWindow = remote.BrowserWindow.getFocusedWindow();

let minimizar = document.getElementById('minimizar');
minimizar.addEventListener('click', function(e) {
    e.preventDefault();
    mainWindow.minimize();
});

let maximizar = document.getElementById('maximizar');
maximizar.addEventListener('click', function(e) {
    e.preventDefault();
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
        maximizar.textContent = 'maximizar';
    } else {
        mainWindow.maximize();
        maximizar.textContent = 'restaurar';
    }
});

let fullscreen = document.getElementById('fullscreen');
fullscreen.addEventListener('click', function(e) {
    e.preventDefault();
    let isFull = mainWindow.isFullScreen();
    mainWindow.setFullScreen(!isFull);
});

let fechar = document.getElementById('fechar');
fechar.addEventListener('click', function(e) {
    e.preventDefault();
    mainWindow.close();
});

let getgif = document.getElementById('getgif');
getgif.addEventListener('click', function(e) {
    e.preventDefault();
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.status == 200) {
            let response = JSON.parse(httpRequest.response);
            let imgUrl = response.data.image_url;
            document.getElementById('showgif').innerHTML = `<img src="${imgUrl}">`;
        }
    }
    httpRequest.open('GET', 'http://api.giphy.com/v1/gifs/random?api_key=Kez8jbUi6GO6XQMXuJ5GT4N4z2S60690');
    httpRequest.send();
});

let notification = document.getElementById('notification');

notification.addEventListener('click', function (e) {
    e.preventDefault();

    let notification = new Notification(
        'Minha notificação',
        {
            body: 'Está é uma notificação bem bacana do meu app',
            icon: path.join(__dirname, './img/tray.png')
        }
    );

    notification.onclick = function () {
        alert('Clicado com sucesso');
    }
});

Mousetrap.bind('up up down down t', function () {
    alert('André dá hadouken! ');
});