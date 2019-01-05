import * as m from "mithril";

export default (initialVnode: any) => {
    let options = {
        numberOfWords: 5,
        numberOfPunctuations: 2,
        numberOfDigits: 2,
        wordListUrl: undefined
    };
    const defaultOptions = JSON.parse(JSON.stringify(options));
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
                            onkeypress(e: any) {
                                const oldV = e.target.value;

                                setTimeout(() => {
                                    const v = parseInt(e.target.value || defaultOptions.numberOfWords);
                                    if (isNaN(v) || v > 10 || v < 1) {
                                        e.target.value = oldV;
                                        return;
                                    }
                                    options.numberOfWords = v;
                                }, 100);
                            }
                        })
                    ]),
                    m(".input-group.col-sm-4.my-1", [
                        m(".input-group-prepend", [
                            m("span.input-group-text", "Number of punctuations")
                        ]),
                        m("input.form-control", {
                            placeholder: options.numberOfPunctuations,
                            onkeypress(e: any) {
                                const oldV = e.target.value;

                                setTimeout(() => {
                                    const v = parseInt(e.target.value || defaultOptions.numberOfPunctuations);
                                    if (isNaN(v) || v > 5 || v < 1) {
                                        e.target.value = oldV;
                                        return;
                                    }
                                    options.numberOfPunctuations = v;
                                }, 100);
                            }
                        })
                    ]),
                    m(".input-group.col-sm-4.my-1", [
                        m(".input-group-prepend", [
                            m("span.input-group-text", "Number of digits")
                        ]),
                        m("input.form-control", {
                            placeholder: options.numberOfDigits,
                            onkeypress(e: any) {
                                const oldV = e.target.value;

                                setTimeout(() => {
                                    const v = parseInt(e.target.value || defaultOptions.numberOfDigits);
                                    if (isNaN(v) || v > 5 || v < 1) {
                                        e.target.value = oldV;
                                        return;
                                    }
                                    options.numberOfDigits = v;
                                }, 100);
                            }
                        })
                    ]),
                    m(".input-group.col-auto.mt-3", [
                        m(".input-group-prepend", [
                            m("span.input-group-text", "Word list URL")
                        ]),
                        m("input#wordListUrl.form-control", {
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