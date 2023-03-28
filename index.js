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

        if (e.inputType !== "insertParagraph") {
            const textContent = codeEditor.innerHTML;

            codeEditor.innerHTML = textContent.replace(jsRegex, '<span class="tN24JUN6SHzetFRvTMWP">$1</span>');


            if (e.data == "{") codeEditor.innerHTML += "}"
            if (e.data == "[") codeEditor.innerHTML += "]"
            if (e.data == "<") codeEditor.innerHTML += ">"

            placeCaretAtEnd(codeEditor);

            var el = document.getElementById('code-editor')[0],
                cur_pos = 0;

            if (el.selectionStart) {
                cur_pos = el.selectionStart;
            } else if (document.selection) {
                el.focus();

                var r = document.selection.createRange();
                if (r != null) {
                    var re = el.createTextRange(),
                        rc = re.duplicate();
                    re.moveToBookmark(r.getBookmark());
                    rc.setEndPoint('EndToStart', re);

                    cur_pos = rc.text.length;
                }
            }

            if (el.setSelectionRange) {
                el.focus();
                el.setSelectionRange(cur_pos - myval, cur_pos - myval);
            }
            else if (el.createTextRange) {
                var range = el.createTextRange();
                range.collapse(true);
                range.moveEnd('character', cur_pos - myval);
                range.moveStart('character', cur_pos - myval);
                range.select();
            }
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