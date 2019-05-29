import html from "./index.pug";

document.getElementById("App")!.innerHTML = html;
document.getElementById("pp-password-area")!.style.height = `${innerHeight - document.getElementById("pp-options-area")!.clientHeight}px`;

const el = {
    preset: document.getElementById("pp-select-preset") as HTMLSelectElement,
    customDiv: document.getElementById("pp-div-custom") as HTMLDivElement,
    numberOfWords: document.getElementById("pp-input-number-of-words") as HTMLInputElement,
    numberOfPunctuations: document.getElementById("pp-input-number-of-punctuations") as HTMLInputElement,
    numberOfDigits: document.getElementById("pp-input-number-of-digits") as HTMLInputElement,
    wordListUrl: document.getElementById("pp-input-word-list-url") as HTMLInputElement,
    rememberMe: document.getElementById("pp-input-remember-me") as HTMLInputElement,
    generatePassword: document.getElementById("pp-button-generate-password") as HTMLButtonElement,
    password: document.getElementById("pp-password") as HTMLHeadingElement
};

let options = {
    preset: "",
    numberOfWords: 5,
    numberOfPunctuations: 2,
    numberOfDigits: 2,
    wordListUrl: new URL("eff-large-cleaned.txt", location.href).href
};
const defaultOptions = JSON.parse(JSON.stringify(options));
let rememberMe = false;

const localOptions = JSON.parse(localStorage.getItem("passwordOptions") || "{}");
if (localOptions.numberOfWords !== undefined) {
    options = localOptions;
    rememberMe = true;
}

el.preset.value = options.preset;
el.preset.onchange = () => {
    options.preset = el.preset.value;

    if (options.preset === "Long compliant") {
        Object.assign(options, {
            numberOfWords: 5,
            numberOfPunctuations: 2,
            numberOfDigits: 2,
        });
    } else if (options.preset === "Long simple") {
        Object.assign(options, {
            numberOfWords: 7,
            numberOfPunctuations: 0,
            numberOfDigits: 0,
        });
    } else if (options.preset === "Short compliant") {
        Object.assign(options, {
            numberOfWords: 3,
            numberOfPunctuations: 2,
            numberOfDigits: 2,
        });
    } else if (options.preset === "Short simple") {
        Object.assign(options, {
            numberOfWords: 3,
            numberOfPunctuations: 0,
            numberOfDigits: 0,
        });
    }

    el.numberOfWords.placeholder = options.numberOfWords.toString();
    el.numberOfPunctuations.placeholder = options.numberOfPunctuations.toString();
    el.numberOfDigits.placeholder = options.numberOfDigits.toString();

    el.customDiv.style.display = !options.preset ? "flex" : "none";
    generatePassword(options).then((s) => el.password.innerText = s);
}

el.customDiv.style.display = !options.preset ? "flex" : "none";

el.numberOfWords.placeholder = options.numberOfWords.toString();
el.numberOfWords.onkeypress = () => {
    const oldV = el.numberOfWords.value;

    setTimeout(() => {
        const v = parseInt(el.numberOfWords.value || defaultOptions.numberOfWords);
        if (isNaN(v) || v > 10 || v < 1) {
            el.numberOfWords.value = oldV;
            return;
        }
        options.numberOfWords = v;
    }, 100);
}

el.numberOfPunctuations.placeholder = options.numberOfPunctuations.toString();
el.numberOfPunctuations.onkeypress = () => {
    const oldV = el.numberOfPunctuations.value;

    setTimeout(() => {
        const v = parseInt(el.numberOfPunctuations.value || defaultOptions.numberOfPunctuations);
        if (isNaN(v) || v > 5 || v < 1) {
            el.numberOfPunctuations.value = oldV;
            return;
        }
        options.numberOfPunctuations = v;
    }, 100);
}

el.numberOfDigits.placeholder = options.numberOfDigits.toString();
el.numberOfDigits.onkeypress = () => {
    const oldV = el.numberOfDigits.value;

    setTimeout(() => {
        const v = parseInt(el.numberOfDigits.value || defaultOptions.numberOfDigits);
        if (isNaN(v) || v > 5 || v < 1) {
            el.numberOfDigits.value = oldV;
            return;
        }
        options.numberOfDigits = v;
    }, 100);
}

el.wordListUrl.placeholder = options.wordListUrl

el.rememberMe.checked = rememberMe;
el.rememberMe.onclick = () => {
    rememberMe = el.rememberMe.checked;
}

el.generatePassword.onclick = () => {
    if (rememberMe) {
        localStorage.setItem("passwordOptions", JSON.stringify(options))
    } else {
        localStorage.removeItem("passwordOptions")
    }

    generatePassword(options).then((s) => el.password.innerText = s);
}

generatePassword(options).then((s) => el.password.innerText = s);

el.password.onclick = () => {
    copyToClipboard(el.password.innerText);
}

async function generatePassword(options: any): Promise<string> {
    const numbersString = "0123456789";
    const punctuationsString = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

    const res = await (await fetch(options.wordListUrl)).text();
    let wordList: string[] = [];
    let passwordComponents: string[] = [];

    if (options.wordListUrl === undefined) {
        wordList = res.split("\n")
            .map((el: string) => {
                return el.split("\t")[1]
            })
            .filter((el: any) => el !== undefined);
    } else {
        wordList = res.trim().split("\n");
    }

    crypto.getRandomValues(new Uint32Array(options.numberOfWords)).forEach((el) => {
        const word = wordList[el % wordList.length];
        passwordComponents.push(word[0].toUpperCase() + word.substring(1));
    });

    let pos = 0;
    crypto.getRandomValues(new Uint32Array(options.numberOfDigits * 2)).forEach((el, index) => {
        if (index % 2 === 0) {
            pos = el % (passwordComponents.length + 1) - 1
        } else {
            passwordComponents.splice(pos, 0, numbersString[el % numbersString.length])
        }
    });

    crypto.getRandomValues(new Uint32Array(options.numberOfPunctuations * 2)).forEach((el, index) => {
        if (index % 2 === 0) {
            pos = el % (passwordComponents.length + 1) - 1
        } else {
            passwordComponents.splice(pos, 0, punctuationsString[el % punctuationsString.length])
        }
    });

    return passwordComponents.join("")
}

function copyToClipboard(str: string) {
    const el = document.createElement('textarea');  // Create a <textarea> element
    el.value = str;                                 // Set its value to the string that you want copied
    el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
    el.style.position = 'absolute';                 
    el.style.left = '-9999px';                      // Move outside the screen to make it invisible
    document.body.appendChild(el);                  // Append the <textarea> element to the HTML document

    const selection = document.getSelection();
    if (selection !== null) {
        const selected =            
            selection.rangeCount > 0                // Check if there is any content selected previously
                ? selection.getRangeAt(0)           // Store selection if found
                : false;                            // Mark as false to know no selection existed before
        el.select();                                // Select the <textarea> content
        document.execCommand('copy');               // Copy - only works as a result of a user action (e.g. click events)
        alert(`Copied ${str}`);

        if (selected) {                             // If a selection existed before copying
            selection.removeAllRanges();            // Unselect everything on the HTML document
            selection.addRange(selected);           // Restore the original selection
        }
    }
    
    document.body.removeChild(el);                  // Remove the <textarea> element
}
