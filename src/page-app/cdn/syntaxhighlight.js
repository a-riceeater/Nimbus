/**
 * SyntaxHighlight.JS
 * Copyright (c) Elijah Bantugan 2023
 * MIT License
 * @github https://github.com/a-riceeater/SyntaxHiglight.JS
 * @author Elijah Bantugan
 */


const SupportedHighlightLanguages = [
    "js",
    "javascript",
    "html",
    "css",
    "python",
    "py",
    "java"
]

/**
 * The class that provides functions to syntax highlight an element.
 * @param {HTMLElement} Element The element to syntax highlight.
 */

class SyntaxHighlight {
    constructor(element) {

        return {

            /**
             * Syntax highlight the elements text content
             * @param {String} Language The programing language contained in the element, which will be used to determine the syntax highlighting.
             * @param {String} Theme A number specifying the theme used to syntax highlight the text. Options are `light` or `dark`.
             * 
             * If there is a language provided that is not supported, an error will be thrown. Supported languages will be showed on the github repository.
             */

            highlight: function (language = "", theme = "dark") {
                if (!SupportedHighlightLanguages.includes(language)) throw "Language \"" + language + "\" is not supported."

                let text = element.innerText;
                element.classList.add(`${theme}-container`)
                
                if (language.toLowerCase() == "javascript" || language.toLowerCase() == "js") {
                    // Regex

                    // quotes
                    text = text.replace(/(['"`])(.*?)\1/g, (match, p1, p2) => `<span class="${theme}-token-qu">${p1}${p2}${p1}</span>`);

                    text = text.replaceAll("function", `<span class="${theme}-token-function">function</span>`);
                    text = text.replaceAll("if", `<span class="${theme}-token-function">if</span>`);
                    text = text.replaceAll("else", `<span class="${theme}-token-function">else</span>`);

                    text = text.replace(/(element\.)classList\.(add\s*\([^\)]*\))/g, `$1<span class="dark-token-ih">classList</span>.$2`);


                    // .something = / .something=
                    text = text.replaceAll(/\.\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*=/g, `.<span class="dark-token-ih">$1</span> =`);
                    text = text.replaceAll(/\.\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*=/g, `.<span class="dark-token-ih">$1</span>=`);


                    text = text.replaceAll(/([A-Za-z_$][A-Za-z0-9_$]*)\s*\.\s*([A-Za-z_$][A-Za-z0-9_$]*)/g, `<span class="dark-token-else">$1</span>.<span class="${theme}-token-name">$2</span>`);

                    text = text.replaceAll(/([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/g, `<span class="${theme}-token-name">$1</span>(`);


                    // Default                
                    text = text.replaceAll("{", `<span class="${theme}-token-bracket">{</span>`);
                    text = text.replaceAll("}", `<span class="${theme}-token-bracket">}</span>`);
                    text = text.replaceAll("(", `<span class="${theme}-token-bracket">(</span>`);
                    text = text.replaceAll(")", `<span class="${theme}-token-bracket">)</span>`);
                    text = text.replaceAll("[", `<span class="${theme}-token-bracket">[</span>`);
                    text = text.replaceAll("]", `<span class="${theme}-token-bracket">]</span>`);
                    text = text.replaceAll("+", `<span class="${theme}-token-name">+</span>`);
                    text = text.replaceAll(".", `<span class="${theme}-token-else">.</span>`);
                    text = text.replaceAll(";", `<span class="${theme}-token-else">;</span>`);
                    text = text.replaceAll("\\", `<span class="${theme}-token-name">\\</span>`);
                    text = text.replaceAll("void", `<span class="${theme}-token-lb">void</span>`);
                    text = text.replaceAll("constructor", `<span class="${theme}-token-name">constructor</span>`);

                    // Variables

                    text = text.replaceAll(/\bconst\s+([A-Za-z_$][A-Za-z0-9_$]*)/g, `<span class="${theme}-token-function">const</span> <span class="${theme}-token-dcvn">$1</span>`);
                    text = text.replaceAll(/\blet\s+([A-Za-z_$][A-Za-z0-9_$]*)/g, `<span class="${theme}-token-function">let</span> <span class="${theme}-token-dcvn">$1</span>`);
                    text = text.replaceAll(/\bvar\s+([A-Za-z_$][A-Za-z0-9_$]*)/g, `<span class="${theme}-token-function">var</span> <span class="${theme}-token-dcvn">$1</span>`);

                    // Important other Keywords
                    text = text.replaceAll("return", `<span class="${theme}-token-function">return</span>`);
                    text = text.replaceAll("break", `<span class="${theme}-token-function">break</span>`);
                    text = text.replaceAll("throw ", `<span class="${theme}-token-function">throw </span>`);
                    text = text.replaceAll("import ", `<span class="${theme}-token-function">import </span>`);
                    text = text.replaceAll("new ", `<span class="${theme}-token-function">new </span>`);


                    // Classes
                    text = text.replaceAll(/\bclass\s+([A-Za-z_$][A-Za-z0-9_$]*)/g, `<span class="${theme}-token-function">class</span> <span class="${theme}-token-dy">$1</span>`);

                    // comments
                    text = text.replaceAll(/\/\/(.*)/g, `<span class="dark-token-comment">//$1</span>`);
                    text = text.replace(/\/\*([\s\S]*?)\*\//g, `<span class="dark-token-comment">/*$1*/</span>`);
                    text = text.replace(/@(\w+)/g, `<span class="dark-token-function">@$1</span>`);

                    text = text.replace(/\b(\w+):/g, `<span class="dark-token-name">$1:</span>`);

                    element.innerHTML = text;
                }
                else if (language.toLowerCase() == "html") {
                    element.innerHTML = text.replace(/<(\/?[a-zA-Z0-9-]+)((?:\s+[\w-]+(?:=(?:"[^"]*"|'[^']*'))?)*)\s*\/?>/g, (match, tagName, attributes) => {
                        const highlightedAttributes = attributes.replace(/([\w-]+)=(?:"([^"]*)"|'([^']*)')/g, (attrMatch, attrName, attrValueDouble, attrValueSingle) => {
                            const attrValue = attrValueDouble || attrValueSingle;
                            return `<span class="dark-token-dcvn">${attrName}</span>=<span class="dark-token-qu">&quot;${attrValue}&quot;</span>`;
                        });

                        return `<span class="dark-token-ih">&lt;${tagName}${highlightedAttributes}${tagName.endsWith('/') ? '/' : ''}&gt;</span>`;
                    });
                }

            }
        }
    }
}
