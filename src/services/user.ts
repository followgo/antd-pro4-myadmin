import request from '@/utils/request'

interface IApi {
  status: number
  message: string
}

export interface ILoginByAccountParamsType {
  username: string
  password: string
}

export interface IToken {

}

export interface IUserAccount {
  uuid: string,
  username: string,
  password: string,
  email?: string,
  nickname?: string,
  avatar?: string,
  authority: 'admin' | 'user' | 'guest'
  enabled: boolean
}

// 使用用户名和密码登入系统
export async function loginByAccount(params: ILoginByAccountParamsType) {
  return request('/user/login/account', {
    method: 'POST',
    data: params,
  })
}

// 登出系统
export async function logout() {
  return request('/user/logout', { method: 'POST' })
}

export async function queryMySettings() {
  return request('/user/accounts/mysettings')
}