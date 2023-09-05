const highlight = new SyntaxHighlight(highlightElement);

function updateHighlight(updateChanges) {
    console.log("%cFormating...", "color: lightblue")
    if (updateChanges == true) console.log("%cSkipping changes status...", "color: yellow")

    const code = codeElement.value;
    if (!updateChanges == true) {
        unsavedChanges = true;
        document.querySelector(".currentEditingTab > .fileBtnContent > .file-name").classList.add("unsavedChanges")
    }
    try {
        /*if (!invalidFormat) {
            var highlightedCode = Prism.highlight(code, Prism.languages[currentLanguage], currentLanguage);
            highlightElement.innerHTML = highlightedCode;
        } else {
            highlightElement.innerHTML = code.sanitizeHTML()
        }*/

        currentLanguage == "html" ? highlightElement.innerText = code : highlightElement.innerHTML = code;
        if (!invalidFormat) {
            console.log(currentLanguage)
            highlight.highlight(currentLanguage);
        }

    } catch (err) {
        invalidFormat = true;
        highlightElement.innerHTML = code.sanitizeHTML()
        console.log("%cInvalid format detected. Name: " + currentLanguage, "color: red")
        console.error(err)
    }

}

String.prototype.sanitizeHTML = function () {
    return this.replace(new RegExp("&", "g"), "&amp;")
        .replace(new RegExp("<", "g"), "&lt;")
}

codeElement.addEventListener('input', updateHighlight);
codeElement.addEventListener("scroll", () => sync_scroll(codeElement))

function sync_scroll(element) {
    let result_element = highlightElement;

    let scrollTop = element.scrollTop;

    result_element.scrollTop = scrollTop;
    result_element.scrollLeft = element.scrollLeft;

    console.log(result_element.scrollTop, scrollTop)
}

var lastChar;
codeElement.addEventListener("keydown", (event) => {
    let code = codeElement.value;
    if (event.ctrlKey) {
        event.stopImmediatePropagation();
        return handleShortcuts(event);
    }

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

    // easyHtml
    if (currentLanguage == "html") {
        switch (event.key) {
            case ">":
                
                break;
        }
    }

    updateHighlight();

})