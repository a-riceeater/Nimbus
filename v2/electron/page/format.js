const codeElement = document.querySelector("#code");
const highlightElement = document.getElementById('highlight');

function updateHighlight() {
    const code = codeElement.value;
    var highlightedCode = Prism.highlight(code, Prism.languages.javascript, 'javascript');

    highlightElement.innerHTML = highlightedCode;
}

codeElement.addEventListener('input', updateHighlight);
codeElement.addEventListener("scroll", () => sync_scroll(codeElement))

function sync_scroll(element) {
    let result_element = highlightElement;
    result_element.scrollTop = element.scrollTop;
    result_element.scrollLeft = element.scrollLeft;
}

var lastChar;
codeElement.addEventListener("keydown", (event) => {
    let code = codeElement.value;

    switch (event.key) {
        case "Tab":

            event.preventDefault();
            var before_tab = code.slice(0, codeElement.selectionStart);
            var after_tab = code.slice(codeElement.selectionEnd, codeElement.value.length);
            var cursor_pos = codeElement.selectionStart + 1;
            codeElement.value = before_tab + "\t" + after_tab

            codeElement.selectionStart = cursor_pos;
            codeElement.selectionEnd = cursor_pos;
            break;

        case "{":

            event.preventDefault();
            var before_tab = code.slice(0, codeElement.selectionStart);
            var after_tab = code.slice(codeElement.selectionEnd, codeElement.value.length);
            var cursor_pos = codeElement.selectionStart + 1;
            codeElement.value = before_tab + "{}" + after_tab;

            codeElement.selectionStart = cursor_pos;
            codeElement.selectionEnd = cursor_pos;


            break;

        case "}":
            event.preventDefault();
            var before_tab = code.slice(0, codeElement.selectionStart);
            var after_tab = code.slice(codeElement.selectionEnd, codeElement.value.length);
            var cursor_pos = codeElement.selectionStart + 1;


            var lastChar = code.charAt(codeElement.selectionStart - 1)

            if (lastChar == "{" && code.charAt(codeElement.selectionStart) == "\}") {
                codeElement.selectionStart = cursor_pos;
                codeElement.selectionEnd = cursor_pos;
            } else {
                codeElement.value = before_tab + "\}" + after_tab;
                codeElement.selectionStart = cursor_pos;
                codeElement.selectionEnd = cursor_pos;
            }

            break;

        case "Enter":
            event.preventDefault();
            var before_tab = code.slice(0, codeElement.selectionStart);
            var after_tab = code.slice(codeElement.selectionEnd, codeElement.value.length);
            var cursor_pos = codeElement.selectionStart + 1;

            var lastChar = code.charAt(codeElement.selectionStart - 1)

            if (lastChar == "{" && code.charAt(codeElement.selectionStart) == "\}") {
                codeElement.value = before_tab + "\n\t\n" + after_tab;
                codeElement.selectionStart = cursor_pos;
                codeElement.selectionEnd = cursor_pos;
            } else {
                codeElement.value = before_tab + "\n" + after_tab;
                codeElement.selectionStart = cursor_pos;
                codeElement.selectionEnd = cursor_pos;
            }

            break;

        case "\"":
            event.preventDefault();
            var before_tab = code.slice(0, codeElement.selectionStart);
            var after_tab = code.slice(codeElement.selectionEnd, codeElement.value.length);
            var cursor_pos = codeElement.selectionStart + 1;
            codeElement.value = before_tab + "\"\"" + after_tab;

            codeElement.selectionStart = cursor_pos;
            codeElement.selectionEnd = cursor_pos;
            break;
        case "\'":

            event.preventDefault();
            var before_tab = code.slice(0, codeElement.selectionStart);
            var after_tab = code.slice(codeElement.selectionEnd, codeElement.value.length);
            var cursor_pos = codeElement.selectionStart + 1;
            codeElement.value = before_tab + "\'\'" + after_tab;

            codeElement.selectionStart = cursor_pos;
            codeElement.selectionEnd = cursor_pos;

            var lastChar = code.charAt(codeElement.selectionStart - 1)

            codeElement.value = before_tab + "\'\'" + after_tab;
            codeElement.selectionStart = cursor_pos;
            codeElement.selectionEnd = cursor_pos;

            break;

            // can't really figure it out rn

            if (lastChar == "\'" && code.charAt(codeElement.selectionStart) == "\'") {
                codeElement.selectionStart = cursor_pos;
                codeElement.selectionEnd = cursor_pos;
                console.log(cursor_pos)
            } else {
                console.log(before_tab + "\'" + after_tab);
                codeElement.value = before_tab + "\'\'" + after_tab;
                codeElement.selectionStart = cursor_pos;
                codeElement.selectionEnd = cursor_pos;
            }
            break;
        case "\(":

            event.preventDefault();
            var before_tab = code.slice(0, codeElement.selectionStart);
            var after_tab = code.slice(codeElement.selectionEnd, codeElement.value.length);
            var cursor_pos = codeElement.selectionStart + 1;
            codeElement.value = before_tab + "\(\)" + after_tab;

            codeElement.selectionStart = cursor_pos;
            codeElement.selectionEnd = cursor_pos;
            break;
        case "\)":
            event.preventDefault();
            var before_tab = code.slice(0, codeElement.selectionStart);
            var after_tab = code.slice(codeElement.selectionEnd, codeElement.value.length);
            var cursor_pos = codeElement.selectionStart + 1;


            var lastChar = code.charAt(codeElement.selectionStart - 1)

            if (lastChar == "(" && code.charAt(codeElement.selectionStart) == "\)") {
                codeElement.selectionStart = cursor_pos;
                codeElement.selectionEnd = cursor_pos;
            } else {
                codeElement.value = before_tab + "\)" + after_tab;
                codeElement.selectionStart = cursor_pos;
                codeElement.selectionEnd = cursor_pos;
            }

            break;
    }

    updateHighlight();

})