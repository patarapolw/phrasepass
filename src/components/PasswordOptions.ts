import * as m from "mithril";

export default (initialVnode: any) => {
    let options = {
        numberOfWords: 5,
        numberOfPunctuations: 2,
        numberOfDigits: 2,
        wordListUrl: undefined
    };
    let rememberMe: boolean = false;

    return {
        oninit(vnode: any) {
            const localOptions = JSON.parse(localStorage.getItem("passwordOptions") || "{}");
            if (localOptions.numberOfWords !== undefined) {
                options = localOptions;
                rememberMe = true;
            }
        },
        view(vnode: any) {
            return m(".col", [
                m(".form-row.align-items-center", [
                    m(".input-group.col-sm-4.my-1", [
                        m(".input-group-prepend", [
                            m("span.input-group-text", "Number of words")
                        ]),
                        m("input.form-control", {
                            placeholder: options.numberOfWords,
                            oninput(e: any) {
                                const v = parseInt(e.target.value);
                                if (isNaN(v)) return false;
    
                                options.numberOfWords = v;
                                e.target.value = v;
                                return true;
                            }
                        })
                    ]),
                    m(".input-group.col-sm-4.my-1", [
                        m(".input-group-prepend", [
                            m("span.input-group-text", "Number of punctuations")
                        ]),
                        m("input.form-control", {
                            placeholder: options.numberOfPunctuations,
                            oninput(e: any) {
                                const v = parseInt(e.target.value);
                                if (isNaN(v)) return false;
    
                                options.numberOfPunctuations = v;
                                e.target.value = v;
                                return true;
                            }
                        })
                    ]),
                    m(".input-group.col-sm-4.my-1", [
                        m(".input-group-prepend", [
                            m("span.input-group-text", "Number of digits")
                        ]),
                        m("input.form-control", {
                            placeholder: options.numberOfDigits,
                            oninput(e: any) {
                                const v = parseInt(e.target.value);
                                if (isNaN(v)) return false;
    
                                options.numberOfDigits = v;
                                e.target.value = v;
                                return true;
                            }
                        })
                    ]),
                    m(".input-group.col-auto.mt-3", [
                        m(".input-group-prepend", [
                            m("span.input-group-text", "Word list URL")
                        ]),
                        m("input.form-control.text-right", {
                            placeholder: options.wordListUrl || vnode.attrs.wordListUrl
                        })
                    ])
                ]),
                m(".form-row.align-items-center.flex-row-reverse.mt-3", [
                    m(".col-auto", [
                        m("button.btn.btn-primary", {
                            onclick(e: any) {
                                if (rememberMe) {
                                    localStorage.setItem("passwordOptions", JSON.stringify(options))
                                } else {
                                    localStorage.removeItem("passwordOptions")
                                }
    
                                vnode.attrs.generatePassword(options)
                            }
                        }, "Generate Password")
                    ]),
                    m(".col-auto", [
                        m(".form-check", [
                            m("input[type=checkbox].form-check-input#rememberMe", {
                                checked: rememberMe,
                                onclick(e: any) {
                                    rememberMe = e.target.checked;
                                }
                            }),
                            m("label[for=rememberMe].form-check-label", "Remember me")
                        ])
                    ])
                ])
            ]);
        }
    }
}