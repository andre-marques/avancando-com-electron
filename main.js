const { BrowserWindow, app, Tray, Menu, globalShortcut, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const url = require('url');
const path = require('path');
const http = require('http');

if (process.env.NODE_ENV == 'development') {
    require('electron-reload')(__dirname);
}

app.setAppUserModelId('com.schoolofnet.electron-curso');

let mainWindows;

function createWindow () {
    mainWindows = new BrowserWindow({
        width: 800,
        height: 600
    });

    let file = url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    });

    mainWindows.loadURL(file);

    if (process.env.NODE_ENV == 'development') {
        mainWindows.webContents.openDevTools();
    }

    mainWindows.on('maximize', () => console.log('maximizado'));
    mainWindows.on('unmaximize', () => console.log('restaurado do maximizado'));
    mainWindows.on('minimize', () => console.log('minimizado'));
    mainWindows.on('restore', () => console.log('restaurado'));
    mainWindows.on('close', () => console.log('fechando'));
    mainWindows.on('resize', () => console.log('tamanho alterado'));

    /*http.get({
        hostname: 'api.giphy.com',
        port: 80,
        path: '/v1/gifs/random?api_key=Kez8jbUi6GO6XQMXuJ5GT4N4z2S60690'
    }, function (res) {
        let output;
        res.on('data', function(chuck) {
            output += chuck;
        });
        res.on('end', function() {
            let response = output.replace(/^undefined/, '');
            response = JSON.parse(response);
            console.log(response.data.image_url);
        });
    });*/

    let contextMenu = Menu.buildFromTemplate([
        {
            label: 'Mostrar aplicativo', click: function () {
                mainWindows.show();
            }
        },
        {
            label: 'Sair', click: function () {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);

    let tray = new Tray(path.join(__dirname, 'img/tray.png'));
    tray.setContextMenu(contextMenu);

    mainWindows.on('minimize', function(e) {
        e.preventDefault();
        mainWindows.hide();
    });

    mainWindows.on('close', function(e) {
        if (!app.isQuiting) {
            e.preventDefault();
            mainWindows.hide();
        }
    });

    tray.on('click', function() {
        mainWindows.isVisible() ? mainWindows.hide() : mainWindows.show();
    });

    mainWindows.on('show', function () {
        tray.setHighlightMode('always');
    });

    globalShortcut.register('CommandOrControl+X', function () {
        console.log('Quem disse que você pode recortar isso?');
    });

    globalShortcut.register('Alt+A', function () {
        console.log('Alt + A foi precionado');
    });
}

function sendStatusToWindow(text) {
    const dialogOpts = {
        type: 'info',
        buttons: ['Ok'],
        title: 'Atualização do aplicativo',
        message: 'Detalhes:',
        detail: text
    }

    dialog.showMessageBox(dialogOpts)
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
})

autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
})

autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
})

autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
})

autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
})

autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
});


app.on('ready', function () {
    autoUpdater.checkForUpdatesAndNotify();
    createWindow();
});