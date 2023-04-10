const { app, BrowserWindow } = require('electron')
const path = require("path")
require('@electron/remote/main').initialize()

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            devTools: true
        },
        resizable: false,
        frame: false,
        devTools: true,
        contextIsolation: false,
        enableRemoteModule: true,
        //icon: path.join(__dirname + '/relico.ico'),
    })

    win.loadFile('./page/index.html')
    require('@electron/remote/main').enable(win.webContents)
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})