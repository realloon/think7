class Think7Tools {
    static getInstance() {
        if (!this.instance) {
            this.instance = new Think7Tools()
        }
        return this.instance
    }

    encode(text) {
        return window.btoa(window.encodeURIComponent(text))
    }

    decode(text) {
        return window.decodeURIComponent(window.atob(text))
    }

    getDate() {
        const date = new Date()
        const current = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            week: '星期' + '日一二三四五六'.charAt(date.getDay()),
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds()
        }

        return current
    }

    removeLastChar(text) {
        return text.substring(0, text.length - 1)
    }

    hasChinese(text) {
        return Boolean(text.match(/[\u4e00-\u9fa5]/))
    }
}
let tools = Think7Tools.getInstance()

class Database {
    static _username = tools.decode(localStorage.getItem('username'))
    static _love = tools.decode(localStorage.getItem('love'))
    static _lastMethod = localStorage.getItem('lastMethod')
    static _history = localStorage.getItem('history')

    static get username() { return Database._username }
    static set username(value) {
        Database._username = value
        localStorage.setItem('username', tools.encode(value))
    }

    static get love() { return Database._love }
    static set love(value) {
        Database._love = value
        localStorage.setItem('love', tools.encode(value))
    }

    static get lastMethod() { return Database._lastMethod }
    static set lastMethod(value) {
        Database._lastMethod = value
        localStorage.setItem('lastMethod', value)
    }

    static get history() { return Database._history }
    static set history(value) {
        Database._history = value
        localStorage.setItem('history', value)
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Database()
        }
        return this.instance
    }
}
let database = Database.getInstance()

class Think7Terminal {
    static VERSION = '0.0.3'

    static addHistory(method) {
        Database.history += ',' + method
    }

    clear() {
        return 'Think7 Terminal'
    }

    greet() {
        let current = tools.getDate()
        let time = ''

        if (current.hours <= 9) { // FIXME: 没有正确判断凌晨（晚上），且时辰应属于getDate()方法
            time = '早上'
        } else if (current.hours <= 12) {
            time = '上午'
        } else if (current.hours <= 13) {
            time = '中午'
        } else if (current.hours <= 18) {
            time = '下午'
        } else {
            time = '晚上'
        }

        let text = `${time}好，${Database.username}，今天是 ${current.year} 年 ${current.month} 月 ${current.day} 日，${current.week}。`
        return text
    }

    version() {
        return Think7Terminal.VERSION
    }

    love() {
        return `${Database.love}❤️`
    }

    username() {
        return Database.username
    }

    echo(text) {
        return text
    }

    history() {
        let history = Database.history.split(',')
        let r = ''

        history.forEach((item, index) => {
            r += `${index} ${item}\n`
        })

        return r
    }

    database() {
        let r = ''

        let keys = Object.keys(Database)

        keys.forEach((key => {
            if (key !== 'instance') {
                key = key.replace('_', '')
                r += `- ${key}: ${Database[key]}\n`
            }
        }))

        r += DOMrenderChar('This data is saved in localStorage', 'remind')
        return r
    }

    date() {
        let current = tools.getDate()
        let r = `${current.year} 年 ${current.month} 月 ${current.day} 日 ${current.hours}:${current.minutes}:${current.seconds}`

        return r
    }

    translate(query) {
        runTranslate(query, printf)
    }

    bmi(height, weight) { // TODO: 当参数不合法时，返回引导
        if (height && weight) {
            let bmi = weight / (height * height)
            return bmi.toString()
        }
        else {
            return 'bmi [height_m] [weight_kg]'
        }
    }
}

function confirm() { } // TODO: 二次确认

function parser(text) {
    text = text.trim()
    
    let isSingleMethod = !text.trim().includes(' ')
    let method = ''
    let chain = ''
    let params = []

    if (isSingleMethod) {
        method = text
    } else {
        let n = text.indexOf(' ')
        method = text.substring(0, n)
        chain = text.substring(n + 1)

        if (chain !== '') {
            params = chain.trim().split(/\s+/)
        }
    }

    return { source: text, keyword: method, chain: chain, params: params }
}

axios.jsonp = (url, data) => {
    if (!url)
        throw new Error('url is necessary')
    const callback = 'CALLBACK' + Math.random().toString().substring(9, 18)
    const JSONP = document.createElement('script')
    JSONP.setAttribute('type', 'text/javascript')

    const headEle = document.getElementsByTagName('head')[0]

    let ret = ''
    if (data) {
        if (typeof data === 'string')
            ret = '&' + data
        else if (typeof data === 'object') {
            for (let key in data)
                ret += '&' + key + '=' + encodeURIComponent(data[key])
        }
        ret += '&_time=' + Date.now()
    }
    JSONP.src = `${url}?callback=${callback}${ret}`
    return new Promise((resolve, reject) => {
        window[callback] = r => {
            resolve(r)
            headEle.removeChild(JSONP)
            delete window[callback]
        }
        headEle.appendChild(JSONP)
    })
}

function runTranslate(q, fun) {
    const appid = '20220709001268611'
    const key = 'fX9OsTNz_zLSn35kgX3f'
    let salt = (new Date).getTime()
    let query = q
    let from, to

    if (tools.hasChinese(q)) {
        from = 'zh'
        to = 'en'
    } else {
        from = 'en'
        to = 'zh'
    }

    let str1 = appid + query + salt + key
    let sign = MD5(str1)

    axios.jsonp('http://api.fanyi.baidu.com/api/trans/vip/translate', {
        q: query,
        from: from,
        to: to,
        salt: salt,
        appid: appid,
        sign: sign,
    }).then((response) => {
        let result = response.trans_result[0].dst
        fun(result)
    }).catch((error) => {
        console.log(error)
    })
}