const codeEditor = document.getElementById("code-editor");

// Add an event listener for changes to the code editor content
codeEditor.addEventListener("input", (e) => {
    console.log(e.inputType, e.data)
    if (e.inputType === 'insertParagraph') {
        placeCaretAtEnd(codeEditor);
        codeEditor.scrollBottom();
        lineNumbers.scrollBottom();
    }
    else {
        const jsRegex = /\b(var|let|const|function|if(?!\()|else|for|while|do|switch|case|break|return)\b/g;

        // Only update the content if it's not a line break
        if (e.inputType !== "insertParagraph") {
            const textContent = codeEditor.innerHTML;

            // Replace the regex with the span and update the innerHTML
            codeEditor.innerHTML = textContent.replace(jsRegex, '<span class="tN24JUN6SHzetFRvTMWP">$1</span>');

            // Place the caret at the end of the editor
            placeCaretAtEnd(codeEditor);
        }
    }

});

codeEditor.addEventListener("keyup", (e) => {
    if (e.key == " ") {
        e.preventDefault();
        codeEditor.innerHTML += "&nbsp;";
        placeCaretAtEnd(codeEditor);
    }
    else if (e.key == "Backspace") {
        const sel = window.getSelection();
        const range = sel.getRangeAt(0);
        const selectedNode = sel.focusNode;
        const caretPosition = range.startOffset;

        if (caretPosition === 0 && selectedNode.nodeName !== "DIV") {
            e.preventDefault();
            const previousSibling = selectedNode.previousSibling;
            codeEditor.removeChild(selectedNode);
            placeCaretAtEnd(previousSibling);
        }
    }
});

function placeCaretAtEnd(el) {
    el.focus();

    if (
        typeof window.getSelection != "undefined" &&
        typeof document.createRange != "undefined"
    ) {
        var range = document.createRange();
        var sel = window.getSelection();

        if (el.lastChild && el.lastChild.nodeName == "BR") {
            range.setStartBefore(el.lastChild);
            range.setEndBefore(el.lastChild);
        } else {
            range.selectNodeContents(el);
            range.collapse(false);
        }

        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}
const lineNumbers = document.querySelector("#line-numbers > div");

function updateLineNumbers() {
    const code = codeEditor.innerHTML;
    const lines = code.split("<div>").length;
    console.log(lines)
    lineNumbers.innerHTML = "";
    for (let i = 1; i <= lines; i++) {
        lineNumbers.innerHTML += i + "<br>";
    }
}

codeEditor.addEventListener("input", (e) => {
    updateLineNumbers();
});

updateLineNumbers();