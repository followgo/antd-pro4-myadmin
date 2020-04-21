interface ITokenStorage {
    login_status: 'ok' | 'aborted' | 'void'
    access_token?: string
    token_type?: string
    refresh_token?: string
}

const saveKeys: string[] = []

export default {
    get(): ITokenStorage {
        const tokenStorage: ITokenStorage = { login_status: 'void' }
        saveKeys.forEach(key => {
            tokenStorage[key] = sessionStorage.getItem(key)
        })
        return tokenStorage
    },

    save(token: ITokenStorage) {
        Object.keys(token).forEach(key => {
            saveKeys.push(key)
            sessionStorage.setItem(key, token[key])
        })
    },

    clear() {
        saveKeys.forEach(key => {
            sessionStorage.removeItem(key)
        })
        saveKeys.length = 0
    },
}