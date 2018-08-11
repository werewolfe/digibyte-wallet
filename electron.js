const {app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const DigiByte = require("digibyte");

exports.getAddress = (privateKey) => {
    var result = "";
    if(privateKey && privateKey != "") {
        result = DigiByte.PrivateKey.fromWIF(privateKey).toAddress().toString();
    } else {
        privateKey = new DigiByte.PrivateKey();
        result = privateKey.toAddress();
    }
    return result;
}

exports.createTransaction = (utxos, sourcePrivateKey, sourceAddress, destinationAddress, changeAddress, satoshis) => {
    return new Promise((resolve, reject) => {
        if(utxos.length == 0) {
            reject({ "message": "The source address has no unspent transactions" });
        }
        var transaction = new DigiByte.Transaction();
        for(var i = 0; i < utxos.length; i++) {
            transaction.from(utxos[i]);
        }
        transaction.to(destinationAddress, satoshis);
        transaction.change(changeAddress);
        transaction.sign(sourcePrivateKey);
        resolve(transaction.serialize());
    });
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 650})

    console.log(__dirname);

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.setResizable(false);

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})