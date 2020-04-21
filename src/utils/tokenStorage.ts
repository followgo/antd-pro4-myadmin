export interface ITokenStorage {
    login_status: 'ok' | 'aborted' | 'nothing'
    access_token?: string
    token_type?: string
    refresh_token?: string
    token_expires_in?: string
    token_obtain_at?: string
}

const keys: string[] = ['login_status', 'access_token', 'token_type', 'refresh_token', 'token_obtain_at', 'token_expires_in']

export default {
    get(): ITokenStorage {
        const tokenStorage: ITokenStorage = { login_status: 'nothing' }
        keys.forEach(key => {
            tokenStorage[key] = sessionStorage.getItem(key)
        })
        return tokenStorage
    },

    save(token: ITokenStorage) {
        keys.forEach(key => {
            sessionStorage.setItem(key, token[key])
        })
        sessionStorage.setItem('token_obtain_at', new Date().toString())
    },

    refreshAccessToken(access_token: string, token_type: string, token_expires_in: string) {
        sessionStorage.setItem('access_token', access_token)
        sessionStorage.setItem('token_type', token_type)
        sessionStorage.setItem('token_expires_in', token_expires_in)
        sessionStorage.setItem('token_obtain_at', new Date().toString())
    },

    clear() {
        keys.forEach(key => {
            sessionStorage.removeItem(key)
        })
        sessionStorage.setItem('login_status', 'nothing')
    },
}