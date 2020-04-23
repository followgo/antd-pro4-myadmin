import request from '@/utils/request'

export interface ILoginByAccountParamsType {
  name_or_email: string
  password: string
}

export interface IUserAccount {
  uuid: string,
  account_name?: string,
  password?: string,
  email?: string,
  nickname?: string,
  avatar?: string,
  authority?: 'admin' | 'user' | 'guest'
  enabled?: boolean
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

export async function patchUserAccount(data: IUserAccount & { new_password?: string }, patch_fields: string[]) {
  return request(`/user/accounts/${data.uuid}`, { method: 'PATCH', data: { data, patch_fields } })
}

export async function deleteUserAccount(uuid: string) {
  return request(`/user/accounts/${uuid}`)
}