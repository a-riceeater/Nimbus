const { ipcRenderer } = require("electron");
let currentEditingFile = '';
let unsavedChanges = false;
let currentLanguage = 'js'
let invalidFormat = false;

function setNewSyntax(language) {
    currentLanguage = language;
}

async function openFile() {
    const file = await ipcRenderer.invoke("openFile");
    const data = await ipcRenderer.invoke("getFileContents", file[0])

    return [file, data];
}

async function openDir() {
    const result = await ipcRenderer.invoke("openDir")
    return result;
}

async function saveFile(fileData) {
    const result = await ipcRenderer.invoke("saveFile", currentEditingFile, fileData);
    console.dir(result);
    return result;
}

const FileManager = { openFile, openDir, saveFile }

var leftAmounts = 0;
window.addEventListener("keydown", (e) => {
    if (e.ctrlKey) e.stopImmediatePropagation();
    handleShortcuts(e);
})

function openFileUser() {
    document.getElementById("codeContainer").style.display = "block"
    FileManager.openFile()
        .then(async (data) => {
            const fdata = data[1];
            var fname = data[0][0].substring(data[0][0].lastIndexOf("."), data[0][0].length).replace(".", "");
            var fnamePure = data[0][0].substring(data[0][0].lastIndexOf("\\"), data[0][0].length).replace("\\", "");

            invalidFormat = false;

            console.log(`%cLoading language ${fname}...`, "color: lightblue")

            if (fname == "htm") fname = "html"

            setNewSyntax(fname);
            currentEditingFile = data[0][0];

            codeElement.value = fdata;
            updateHighlight(fdata);

            const fTab = document.createElement("div");
            fTab.innerHTML = `
                <span class="fileBtnContent">
                <span class="file-type ftype-${fname}">${fname.toUpperCase().substring(0, 3)}</span>
                <span class="file-name">${fnamePure}</span>
                </span>`

            if (leftAmounts != 0) {
                console.log("lm", leftAmounts + "px")
                fTab.style.left = leftAmounts + "px";
            }

            if (leftAmounts == 0) {
                fTab.style.borderLeft = "none"
            }

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

            fTab.addEventListener("click", async (e) => {
                e.preventDefault();
                if (e.target.classList.contains("file-name")) {
                    await prompt("Unsaved changes!", "Continue without saving?", (st) => {
                        if (!st) return

                        Tabs.removeTab();
                    })
                } else {
                    // switch to file
                }
            })
        })
}

function handleShortcuts(e) {
    if (e.key == "o" && e.ctrlKey) {
        openFileUser();
    }

    if (e.key == "s" && e.ctrlKey) {
        if (!currentEditingFile) return;

        unsavedChanges = false;
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