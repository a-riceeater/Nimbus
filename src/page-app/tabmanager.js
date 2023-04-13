console.log("%cTab Manager Loading...", "color: lightblue")
const codeElement = document.querySelector("#code");
const highlightElement = document.getElementById('highlight');
var leftAmounts = 100;


function removeTab() {
    const tab = document.querySelector(".currentEditingTab");
    leftAmounts = leftAmounts - parseInt(tab.style.width.replace("px", ""));
    tab.remove();
    codeElement.value = ''
    highlightElement.innerHTML = ''

    if (leftAmounts == 100) {
        document.getElementById("codeContainer").style.display = "none"
        document.getElementById("welcomePannel").style.display = "block"
    }
}

const Tabs = { removeTab }