import * as m from "mithril";

import PasswordOptions from "./PasswordOptions"

const copyToClipboard = (str: string) => {
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
  };

export default (initialVnode: any) => {
    const baseUrl = "https://patarapolw.github.io/phrasepass"

    let password = "GeneratedPasswordWillBeHere#*@)(#*)";
    let wordListUrl = (location.href.indexOf(baseUrl) === -1 ? location.origin : baseUrl) + "/eff_large_wordlist.txt"

    const numbersString = "0123456789";
    const punctuationsString = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
    
    function generatePassword(options: any) {
        m.request(options.wordListUrl || wordListUrl, {
            deserialize: (el: any) => el
        })
            .then((res: any) => {
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

                m.render(document.getElementById("password") as HTMLElement, passwordComponents.join(""));
            })
    }

    return {
        view(vnode: any) {
            return m(".row.h-100", [
                m(".col-auto.mt-3", [
                    m(PasswordOptions, {
                        wordListUrl,
                        generatePassword
                    }),
                ]),
                m(".col-12.text-center", [
                    m("h1#password.text-monospace", {
                        onclick(e: any) {
                            copyToClipboard(e.target.innerText);
                        }
                    }, password)
                ])
            ])
        }
    }
}
