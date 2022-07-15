document.addEventListener('DOMContentLoaded', () => {
    const terminalE = document.querySelector('#terminal')
    const inputE = document.querySelector('#input')

    let think7 = new Think7Terminal

    window['printf'] = (content, isUser = false) => {
        if (typeof (content) == 'string' && isUser) {
            terminalE.innerHTML += `\n> ${content}`
        } else if (typeof (content) == 'string') {
            terminalE.innerHTML += `\n${content}`
        }
    }

    window['errorf'] = (text) => {
        terminalE.innerHTML += `\n<span class="error">${text}</span>`
    }

    window['DOMrenderChar'] = (text, style) => {
        return `<span class="${style}">${text}</span>`
    }

    function runInput(text) {
        const parse = parser(text)
        const method = parse.keyword
        const chain = parse.chain
        const params = parse.params

        printf(`${DOMrenderChar('>', 'bold')} ${DOMrenderChar(method, 'method')} ${chain}`) // 在终端打印原始输入

        if (Object.getPrototypeOf(think7).hasOwnProperty(method)) {
            if (method == 'echo' || method == 'translate') {
                printf(think7[method](chain))
            } else if (method == 'clear') {
                terminalE.innerHTML = DOMrenderChar(think7.clear(), 'termin-title')
            } else if (params.length !== 0) {
                printf(think7[method](...params))
            } else {
                printf(think7[method]())
            }

            Think7Terminal.addHistory(method)
        } else {
            errorf(`未找到名为 ${method} 的命令`)
        }
    }

    inputE.onkeydown = (e) => {
        switch (e.which) {
            case 13: // 绑定回车
                if (!inputE.value) return

                localStorage.setItem('lastMethod', inputE.value)

                runInput(inputE.value)
                inputE.value = ''
                terminalE.scrollTo({
                    top: terminalE.scrollHeight,
                    behavior: 'smooth'
                })
                break

            case 38: // 绑定上方向键
                if (localStorage.getItem('lastMethod')) { // FIXME: 需要将光标移动到最后
                    inputE.value = localStorage.getItem('lastMethod')
                }
                break
        }
    }

    printf(think7.greet())
})