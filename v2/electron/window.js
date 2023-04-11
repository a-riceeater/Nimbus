const { app, BrowserWindow, ipcMain } = require('electron')
const path = require("path")
require('@electron/remote/main').initialize()

const createMainWindow = () => {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            devTools: true
        },
        resizable: true,
        frame: false,
        devTools: true,
        contextIsolation: false,
        enableRemoteModule: true,
        //icon: path.join(__dirname + '/relico.ico'),
    })

    win.loadFile('./page/index.html')
    require('@electron/remote/main').enable(win.webContents)
}

const createLoaderWindow = () => {
    const win = new BrowserWindow({
        width: 300,
        height: 400,
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

    win.loadFile('./page/loader.html')
    require('@electron/remote/main').enable(win.webContents)
}

app.whenReady().then(createLoaderWindow)

const { dialog } = require("electron");
const fs = require("fs")

ipcMain.handle('openFile', async () => {
    const result = dialog.showOpenDialogSync({ properties: ['openFile'] })
    return result;
})

ipcMain.handle('openDir', async () => {
    const result = dialog.showOpenDialogSync({ properties: ['openDirectory'] })
    return result;
})

// Window

ipcMain.handle('openMain', async () => {
    createMainWindow();
    return true;
})


// File handling

ipcMain.handle("getFileContents", async (event, file) => {
    return fs.readFileSync(file, "utf-8");
})

ipcMain.handle("saveFile", async (event, file, fdata) => {
    console.log(`Saving file ${file}`)
    fs.writeFileSync(file, fdata, "utf8", (err) => { if (err) throw err });
    return true;
})

ipcMain.handle("dirFile", async (event, file) => {
    fs.rmSync(file, (err) => { if (err) throw err; });
    return true;
})

ipcMain.handle("dirDir", async (event, dir) => {
    fs.rmSync(dir, (err) => { if (err) throw err; });
    return true;
})

ipcMain.handle("rnFile", async (event, old, newn) => {
    fs.renameSync(old, newn, (err) => { if (err) throw err; });
    return true;
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})