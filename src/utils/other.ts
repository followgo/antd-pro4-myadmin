
// 递增ID生成器
// 返回闭包函数，每次调用闭包函数 id 增加 1
export function makeIncrIdGenerator(prefix: string = 'item-') {
    let i = 0
    return (): string => {
        i += 1
        return `${prefix}${i}`
    }
}

// 随机生成包含字母和数字的字符串
export function randAlphaNum(length: number): string {
    const charts = Array.prototype.slice.call(
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    ) // ['0', '1', '2'...]
    const chartsLeng = charts.length

    const result: string[] = []
    for (let i = 0; i < length; i += 1) {
        const randInt = Math.floor(Math.random() * chartsLeng)
        result.push(charts[randInt])
    }

    return result.join('')
}

// 读取文件对象，将文件内容转换成 base64
export function convFileToBase64(file: File | Blob): PromiseLike<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result ? reader.result.toString() : '')
        reader.onerror = error => reject(error)
    })
}