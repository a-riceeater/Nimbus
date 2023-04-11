console.log("%cTab Manager Loading...", "color: lightblue")
const codeElement = document.querySelector("#code");
const highlightElement = document.getElementById('highlight');
var leftAmounts = 0;


function removeTab() {
    const tab = document.querySelector(".currentEditingTab");
    leftAmounts = leftAmounts - parseInt(tab.style.width.replace("px", ""));
    tab.remove();
    codeElement.value = ''
    highlightElement.innerHTML = ''
}

const Tabs = { removeTab }