const remote = require("@electron/remote")
const path = require('path');
const u = require("url")
var currentStage = 'license'
const AdmZip = require("adm-zip");
var elevate = require('windows-elevate');
var installOption;
const electron = require('electron');

Object.prototype.scrollBottom = function () { var t; (t = this).scrollTop = t.scrollHeight };

document.getElementById("close").addEventListener("click", () => {
    const window = remote.getCurrentWindow()
    window.close();
})

document.getElementById("minimize").addEventListener("click", () => {
    const window = remote.getCurrentWindow()
    window.minimize();
})

document.getElementById("liAgree").addEventListener("click", () => {
    const e = document.getElementById("liAgree");
    const status = document.getElementById("liAgree").classList.contains("checked")

    console.log(status)

    if (status) {
        e.classList.remove("checked")
        document.getElementById("nextBtn").classList.add("invalid")
    }
    else {
        e.classList.add("checked")
        document.getElementById("nextBtn").classList.remove("invalid")
    }
})

document.getElementById("githubFooter").addEventListener("click", () => {
    require("electron").shell.openExternal("https://github.com/ghwosty/rel");
})

function nextStage() {
    document.querySelectorAll(".stage").forEach(ele => ele.style.display = "none")
    const btn = document.getElementById("nextBtn");

    switch (currentStage) {
        case "license":
            document.getElementById("action").style.display = "block"
            btn.classList.remove("invalid")
            currentStage = "action"
            document.getElementById("backBtn").classList.remove("invalid")
            break;
        case "action":
            currentStage = "installing"
            document.getElementById("installing").style.display = "block"
            setTimeout(installREL, 1000);
            break;
    }
}

document.getElementById("nextBtn").addEventListener("click", () => {
    const btn = document.getElementById("nextBtn");

    if (btn.innerText.includes("Finish")) {
        const window = remote.getCurrentWindow()
        window.close();
        return;
    }

    if (installOption) {
        if (installOption == "install") return nextStage();

        else {
            document.querySelectorAll(".stage").forEach(ele => ele.style.display = "none")

            document.getElementById("uninstalling").style.display = "block"
            btn.classList.add("invalid")
            currentStage = "installing"

            try {
                p2("❔ Detecting directory...")
                if (fs.existsSync("C:\\Program Files\\rel")) {
                    p2("✅ Directory exists, continuing...")
                    p2("⌚ Deleting directory...")

                    fs.rm("C:\\Program Files\\rel", { recursive: true }, (err) => {
                        if (err) {
                            p2(err);
                            p2("Make sure you are running the application with administrator permissions.")
                            return;
                        }

                        p2("🗑️ Rel directory deleted...")
                        p2("✅ Uninstall completed. You may now close the installer.")
                        document.getElementById("nextBtn").innerText = "Finish"
                        document.getElementById("nextBtn").classList.remove("invalid")

                    });
                } else {
                    p2("❌ Error: REL Dirrectory does not exist. Failed to uninstall.")
                    document.getElementById("nextBtn").innerText = "Finish"
                    document.getElementById("nextBtn").classList.remove("invalid")
                }
            } catch (err) {
                p2(err);
                p2("Make sure you are running the application with administrator permissions.")
                document.getElementById("nextBtn").innerText = "Finish"
                document.getElementById("nextBtn").classList.remove("invalid")
            }
        }
        return;
    }

    if (btn.classList.contains("invalid")) return;
    btn.classList.add("invalid")

    nextStage();
})

const fs = require("fs")
function installREL() {
    try {
        p("❔ Detecting directory...")
        if (fs.existsSync("C:\\Program Files\\rel")) {
            p("✅ Directory exists, continuing...")
        } else {
            p("⌚ Directory does not exist, creating...")
            fs.mkdirSync("C:\\Program Files\\rel", (err) => {
                if (err) throw err;
            })
            p("Created directory...")
        }

        p("⌚ Loading base64...")
        const base64Data = require("./base64").base.base;
        p("⌚ Encoding...")

        fs.writeFileSync("C:\\Program Files\\rel\\rel.zip", base64Data, { encoding: 'base64' }, (err) => {
            if (err) throw err;
        })

        p("✅ Encoded! Extracting...")

        const zip = new AdmZip("C:\\Program Files\\rel\\rel.zip");
        zip.extractAllTo("C:\\Program Files\\rel");

        p("✅ Extracted! Removing encoded compressed file...")

        fs.unlinkSync("C:\\Program Files\\rel\\rel.zip", (err) => { if (err) throw err; });

        p("✅ Removed.")
        p("⌚ Adding PATH variables...")

        p("❌ FAILED: Failed to add PATH variables")
        p("Manual PATH instalation required!")
        p("Enviornment Variables > User Variables > PATH")
        p("New > C:\\Program Files\\rel")
        p("Save.")
        p("")
        p("✅ Instalation completed!")

        document.getElementById("nextBtn").innerText = "Finish"
        document.getElementById("nextBtn").classList.remove("invalid")
    } catch (err) {
        p(err);
        p("Make sure you are running the application with administrator permissions.")
    }
}


function p(m) {
    setTimeout(() => {
        const me = document.createElement("p");
        me.innerHTML = m;
        document.getElementById("installingData").appendChild(me);

        document.getElementById("installingData").scrollBottom();
    }, 150)
}

function p2(m) {
    setTimeout(() => {
        const me = document.createElement("p");
        me.innerHTML = m;
        document.getElementById("uninstallingData").appendChild(me);

        document.getElementById("uninstallingData").scrollBottom();
    }, 150)
}


document.querySelectorAll(".actionBtn").forEach(ele => {
    ele.addEventListener("click", (e) => {
        document.querySelectorAll(".selectedAction").forEach(ele => ele.classList.remove("selectedAction"));

        ele.classList.add("selectedAction")

        if (ele.innerText.includes("Uninstall REL")) installOption = "uninstall"
        else installOption = "install"

        console.log(installOption)
    })
})

document.getElementById("backBtn").addEventListener("click", back);

function back() {
    const btn = document.getElementById("backBtn");
    if (btn.classList.contains("invalid")) return;
    document.querySelectorAll(".stage").forEach(ele => ele.style.display = "none")

    switch (currentStage) {
        case "license":
            break;
        case "action":
            document.getElementById("reviewLicense").style.display = "block"
            currentStage = "license"
            document.getElementById("backBtn").classList.add("invalid")
            break;
        case "installing":
            currentStage = "action"
            document.getElementById("backBtn").classList.add("invalid")
            document.getElementById("action").style.display = "block"
            break;
    }
}