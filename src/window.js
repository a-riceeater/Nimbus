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

    win.loadFile('./page-app/index.html')
    require('@electron/remote/main').enable(win.webContents)

    const pty = require("node-pty");
    const os = require("os");
    var shell = os.platform() === "win32" ? "powershell.exe" : "bash";

    var ptyProcess = pty.spawn(shell, [], {
        name: "xterm-color",
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
        env: process.env
    });

    ptyProcess.on('data', function (data) {
        win.webContents.send("terminal.incomingData", data);
    });

    ipcMain.on("terminal.keystroke", (event, key) => {
        ptyProcess.write(key);
    });
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

    win.loadFile('./page-app/loader.html')


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

ipcMain.handle("openDirFiles", async (event, dir) => {
    try {
        if (!dir) return false;
        const files = await fs.readdirSync(dir);
        const fss = [];

        for (const file of files) {
            const fromPath = path.join(dir, file);
            const stat = await fs.promises.stat(fromPath);

            if (stat.isDirectory()) {
                const subfiles = await openDirFilesRecursive(fromPath);
                fss.push([file, subfiles]);
            } else if (stat.isFile()) {
                fss.push(fromPath);
            }
        }

        return fss;

    } catch (error) {
        throw error;
    }
});

async function openDirFilesRecursive(dir) {
    try {
        const files = await fs.promises.readdir(dir);
        const fss = [];

        for (const file of files) {
            const fromPath = path.join(dir, file);
            const stat = await fs.promises.stat(fromPath);

            if (stat.isDirectory()) {
                const subfiles = await openDirFilesRecursive(fromPath);
                fss.push([file, subfiles]);
            } else if (stat.isFile()) {
                fss.push(fromPath);
            }
        }

        return fss;

    } catch (error) {
        throw error;
    }
}



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
    return "Saved.";
})

ipcMain.handle("dirFile", async (event, file) => {
    fs.rmSync(file, (err) => { if (err) throw err; });
    return true;
})

ipcMain.handle("delDir", async (event, dir) => {
    fs.rmSync(dir, (err) => { if (err) throw err; });
    return true;
})

ipcMain.handle("rnFile", async (event, old, newn) => {
    fs.renameSync(old, newn, (err) => { if (err) throw err; });
    return true;
})

// Settings

ipcMain.handle("getLocal", async (event) => {
    if (!fs.existsSync("C:\\Program Files\\Nimbus\\local.json")) return JSON.parse(`{
        "currentFolder": "",
        "currentTabs": []
    }`)
    else return JSON.parse(fs.readFileSync("C:\\Program Files\\Nimbus\\local.json"))
})




app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})