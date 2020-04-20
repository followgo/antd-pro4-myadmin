import request from '@/utils/request'

export interface ILoginByAccountParamsType {
  username: string
  password: string
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
  return request('/user/login/account', { method: 'POST', data: params })
}

// 登出系统
export async function logout() {
  return request('/user/logout', { method: 'POST' })
}

export async function queryMySettings() {
  return request('/user/accounts/mysettings')
}

export async function queryUserAccounts() {
  return request('/user/accounts')
}

export async function updateUserAccount(uuid: string, params: IUserAccount) {
  return request(`/user/accounts/${uuid}`, { method: 'PUT', data: params })
}

export async function patchUserAccount(uuid: string, params: IUserAccount, patch_fields: string[]) {
  return request(`/user/accounts/${uuid}`, { method: 'PATCH', data: { data: params, patch_fields } })
}

export async function deleteUserAccount(uuid: string) {
  return request(`/user/accounts/${uuid}`)
}