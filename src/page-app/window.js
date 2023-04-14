let maxStatus = 'full'

document.getElementById("closeXWindow").addEventListener("click", () => {
    const window = remote.getCurrentWindow();
    window.close();
})

document.getElementById("maximizeWindow").addEventListener("click", () => {
    const window = remote.getCurrentWindow();
    if (maxStatus == 'full') {
        maxStatus = 'mini'
        window.unmaximize();
    } else {
        maxStatus = 'full'
        window.maximize();
    }
})

document.getElementById("minimizeWindow").addEventListener("click", () => {
    const window = remote.getCurrentWindow();
    window.minimize();
})

var promptStatus;

window.prompt = function(title, desc, cb) {
    document.querySelector(".prompt").style.display = "block"
    document.querySelector("#shade").style.display = "block"
    document.getElementById("promptTitle").innerText = title
    document.getElementById("promptDesc").innerText = desc

    const inter = setInterval(() => {
        if (promptStatus != null) {
            clearInterval(inter);
            cb(promptStatus);
            promptStatus = null;
            document.querySelector(".prompt").style.display = "none"
            document.querySelector("#shade").style.display = "none"

            return;
        }
    }, 500)
}

document.getElementById("promptAccept").addEventListener("click", () => {
    promptStatus = true;
})

document.getElementById("promptCancel").addEventListener("click", () => {
    promptStatus = false;
})

document.getElementById("shade").addEventListener("click", () => {
    promptStatus = false;
    
    document.querySelectorAll(".modal").forEach(ele => ele.style.display = "none");
    document.getElementById("shade").style.display = "none"
})