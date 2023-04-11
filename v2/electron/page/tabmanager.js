console.log("%cTab Manager Loading...", "color: lightblue")
const codeElement = document.querySelector("#code");
const highlightElement = document.getElementById('highlight');

function removeTab(name, id) {
    document.querySelector(".currentEditingTab").remove();
    codeElement.value = ''
    highlightElement.innerHTML = ''
}

const Tabs = { removeTab }