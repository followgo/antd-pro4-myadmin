import request from 'umi-request'
import { IBaseResponseData } from './request'

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

// 获取新的 token，然后写入 sessionStorage，并返回最新 access_token
export async function refreshToken(): Promise<string> {
    const refresh_token_str = sessionStorage.getItem('refresh_token')
    if (!refresh_token_str) {
        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('token_type')
        sessionStorage.removeItem('token_expires_in')
        sessionStorage.removeItem('token_obtain_at')
        return ''
    }

    let new_access_token = ''
    let res: IBaseResponseData<{ access_token: string, token_type: string, expires_in: number }>

    // 刷新token
    try {
        res = await request('/user/refresh_token', { headers: { 'X-AUTH-TOKEN': refresh_token_str } })
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('刷新 token 发送错误：', err)

        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('token_type')
        sessionStorage.removeItem('token_expires_in')
        sessionStorage.removeItem('token_obtain_at')
        return ''
    }

    if (res && res.status === 200) {
        new_access_token = res.data.access_token
        sessionStorage.setItem('access_token', res.data.access_token)
        sessionStorage.setItem('token_type', res.data.token_type)
        sessionStorage.setItem('token_expires_in', res.data.expires_in.toString())
        sessionStorage.setItem('token_obtain_at', new Date().toString())
    }

    return new_access_token
}