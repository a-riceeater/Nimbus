const { ipcRenderer } = require("electron");
let currentEditingFile = '';
let unsavedChanges = false;
let currentLanguage = 'js'
let invalidFormat = false;

const currentTabs = [];
let currentLocal = {};

function setNewSyntax(language) {
    currentLanguage = language;
}

async function openFile() {
    const file = await ipcRenderer.invoke("openFile");
    if (!file) return;
    const data = await ipcRenderer.invoke("getFileContents", file[0])

    return [file, data];
}

async function openDir() {
    const result = await ipcRenderer.invoke("openDir")
    return result;
}

async function openDirFiles(dir) {
    const result = await ipcRenderer.invoke("openDirFiles", dir)
    return result;
}

async function saveFile(fileData) {
    const result = await ipcRenderer.invoke("saveFile", currentEditingFile, fileData);
    console.dir(result);
    return result;
}

const FileManager = { openFile, openDir, saveFile }

window.addEventListener("keydown", (e) => {
    if (e.ctrlKey) e.stopImmediatePropagation();
    handleShortcuts(e);
})

function openFileUser() {
    FileManager.openFile()
        .then(async (data) => {
            if (!data) return;
            document.getElementById("codeContainer").style.display = "block"
            const fdata = data[1];
            var fname = data[0][0].substring(data[0][0].lastIndexOf("."), data[0][0].length).replace(".", "");
            var fnamePure = data[0][0].substring(data[0][0].lastIndexOf("\\"), data[0][0].length).replace("\\", "");

            invalidFormat = false;

            console.log(`%cLoading language ${fname}...`, "color: lightblue")

            if (fname == "htm") fname = "html"

            setNewSyntax(fname);
            currentEditingFile = data[0][0];

            codeElement.value = fdata;
            Cache.putCache(data[0][0], fdata)

            currentTabs.push(data[0][0]);

            updateHighlight(true);

            document.getElementById("welcomePannel").style.display = "none"

            const fTab = document.createElement("div");
            fTab.innerHTML = `
                <span class="fileBtnContent">
                <span class="file-type ftype-${fname}">${fname.toUpperCase().substring(0, 3)}</span>
                <span class="file-name">${fnamePure}</span>
                </span>`

            fTab.style.left = leftAmounts + "px";

            if (fnamePure.length > 12) {
                fTab.style.width = (fnamePure.length * 12) + "px";
            } else {
                fTab.style.width = "150px"
            }

            leftAmounts += parseInt(fTab.style.width.replace("px", ""))

            document.querySelectorAll(".currentEditingTab").forEach(ele => ele.classList.remove("currentEditingTab"));

            fTab.classList.add("fileBtn")
            fTab.classList.add("currentEditingTab")

            document.getElementById("fileTab").appendChild(fTab);

            unsavedChanges = false;

            fTab.addEventListener("click", async (e) => {
                e.preventDefault();
                if (e.target.classList.contains("file-name")) {
                    if (unsavedChanges) {
                        await prompt("Unsaved changes!", "Continue without saving?", (st) => {
                            if (!st) return
                            Tabs.removeTab();
                            Cache.deleteCache(data[0][0])
                        })
                    } else {
                        Tabs.removeTab()
                        Cache.deleteCache(data[0][0])
                    }

                } else {

                    codeElement.value = fdata;

                    updateHighlight(true);

                    document.getElementById("welcomePannel").style.display = "none"
                    document.getElementById("codeContainer").style.display = "block"

                    document.querySelectorAll(".currentEditingTab").forEach(ele => ele.classList.remove("currentEditingTab"));
                    fTab.classList.add("currentEditingTab")

                }
            })
        })
}

function handleShortcuts(e) {
    if (e.key == "O" && e.ctrlKey && e.shiftKey) {
        openDir()
            .then((data) => {
                if (!data) return
                const folder = data[0];
                openDirFiles(folder)
                    .then((folderFiles) => {
                        const fileExplorer = document.getElementById("fileExplorer");
                        createFileExplorerElements(folderFiles, fileExplorer);
                    })
            })
    }
    if (e.key == "o" && e.ctrlKey && !e.shiftKey) {
        openFileUser();
    }

    if (e.key == "s" && e.ctrlKey) {
        if (!currentEditingFile) return;

        unsavedChanges = false;
        document.querySelector(".currentEditingTab > .fileBtnContent > .file-name").classList.remove("unsavedChanges")
        saveFile(codeElement.value)
    }

    if (e.key == "w" && e.ctrlKey) {
        if (!currentEditingFile) return;

        e.preventDefault();



        if (!unsavedChanges) return Tabs.removeTab();
        prompt("Unsaved changes!", "Continue without saving?", (st) => {
            if (!st) return

            Tabs.removeTab();
        })
    }

    if (e.key == "r" && e.ctrlKey) {
        e.preventDefault();
        window.location = ''

        // handle saving later
    }

}

document.getElementById("openFolderLabel").addEventListener("click", () => {
    openDir()
        .then((data) => {
            if (!data) return;
            const folder = data[0];
            openDirFiles(folder)
                .then((folderFiles) => {
                    const fileExplorer = document.getElementById("fileExplorer");
                    createFileExplorerElements(folderFiles, fileExplorer);
                })
        })
});

function createFileExplorerElements(files, parentElement) {
    for (const file of files) {
        if (Array.isArray(file)) {
            const folderName = file[0];
            const subfiles = file[1];

            const folderElement = document.createElement("p");
            folderElement.classList.add("explorerFolder");
            folderElement.textContent = `+ ${folderName}`;

            const subfilesElement = document.createElement("div");
            subfilesElement.classList.add("explorerSubfiles");
            subfilesElement.classList.add("hidden");

            folderElement.addEventListener("click", () => {
                subfilesElement.classList.toggle("hidden");
                folderElement.textContent =
                    folderElement.textContent === `+ ${folderName}`
                        ? `- ${folderName}`
                        : `+ ${folderName}`;
            });

            createFileExplorerElements(subfiles, subfilesElement);

            parentElement.appendChild(folderElement);
            parentElement.appendChild(subfilesElement);
        } else {
            const fileElement = document.createElement("p");
            fileElement.classList.add("explorerFile");

            const fileName = file.split("\\").pop();
            const extension = fileName.split(".").pop();

            const spanElement = document.createElement("span");
            spanElement.classList.add(`ftype-${extension}`);
            spanElement.textContent = `${extension.toUpperCase().slice(0, 3)} `;
            fileElement.appendChild(spanElement);

            fileElement.appendChild(document.createTextNode(fileName));

            fileElement.addEventListener("click", async () => {
                const cachedData = Cache.getCache(file)

                const fTab = document.createElement("div");
                fTab.innerHTML = `
                    <span class="fileBtnContent">
                    <span class="file-type ftype-${extension}">${extension.toUpperCase().substring(0, 3)}</span>
                    <span class="file-name">${fileName}</span>
                    </span>`

                fTab.style.left = leftAmounts + "px";

                if (fileName.length > 12) {
                    fTab.style.width = (fileName.length * 12) + "px";
                } else {
                    fTab.style.width = "150px"
                }

                leftAmounts += parseInt(fTab.style.width.replace("px", ""))

                document.querySelectorAll(".currentEditingTab").forEach(ele => ele.classList.remove("currentEditingTab"));

                fTab.classList.add("fileBtn")
                fTab.classList.add("currentEditingTab")

                document.getElementById("fileTab").appendChild(fTab);

                currentTabs.push(file);

                unsavedChanges = false;

                fTab.addEventListener("click", async (e) => {
                    e.preventDefault();
                    if (e.target.classList.contains("file-name")) {
                        if (unsavedChanges) {
                            await prompt("Unsaved changes!", "Continue without saving?", (st) => {
                                if (!st) return
                                Tabs.removeTab();
                                Cache.deleteCache(file)
                            })
                        } else {
                            Tabs.removeTab()
                            Cache.deleteCache(file)
                        }

                    } else {

                        if (!cachedData) {
                            const fdata = await ipcRenderer.invoke("getFileContents", file)

                            codeElement.value = fdata;

                            updateHighlight(true);

                            document.getElementById("welcomePannel").style.display = "none"
                            document.getElementById("codeContainer").style.display = "block"

                            document.querySelectorAll(".currentEditingTab").forEach(ele => ele.classList.remove("currentEditingTab"));
                            fTab.classList.add("currentEditingTab")

                        } else {
                            codeElement.value = cachedData;


                            updateHighlight(true);

                            document.getElementById("welcomePannel").style.display = "none"
                            document.getElementById("codeContainer").style.display = "block"

                            document.querySelectorAll(".currentEditingTab").forEach(ele => ele.classList.remove("currentEditingTab"));
                            fTab.classList.add("currentEditingTab")

                        }

                    }
                })

                if (!cachedData) {
                    const fdata = await ipcRenderer.invoke("getFileContents", file)

                    codeElement.value = fdata;

                    updateHighlight(true);

                    document.getElementById("welcomePannel").style.display = "none"
                    document.getElementById("codeContainer").style.display = "block"

                    document.querySelectorAll(".currentEditingTab").forEach(ele => ele.classList.remove("currentEditingTab"));
                    fTab.classList.add("currentEditingTab")

                } else {
                    codeElement.value = cachedData;


                    updateHighlight(true);

                    document.getElementById("welcomePannel").style.display = "none"
                    document.getElementById("codeContainer").style.display = "block"

                    document.querySelectorAll(".currentEditingTab").forEach(ele => ele.classList.remove("currentEditingTab"));
                    fTab.classList.add("currentEditingTab")

                }
            })

            parentElement.appendChild(fileElement);

        }
    }
}


document.getElementById("openFileLabel").addEventListener("click", openFileUser)


async function getLocal() {
    return await ipcRenderer.invoke("getLocal");
}

getLocal()
.then((data) => {
    currentLocal = data;
})