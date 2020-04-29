import request from '@/utils/request'

export interface ILoginByAccountParamsType {
  name_or_email: string
  password: string
}

export interface IUserAccount {
  uuid: string
  account_name?: string
  password?: string
  email?: string
  nickname?: string
  avatar?: string
  authority?: 'admin' | 'user' | 'guest'
  enabled?: boolean
}

// 使用用户名和密码登入系统
export async function loginByAccount(data: ILoginByAccountParamsType) {
  return request('/api/user/login/account', { method: 'POST', data })
}

// 登出系统
export async function logout() {
  return request('/api/user/logout', { method: 'POST' })
}

export async function queryMySettings() {
  return request('/api/user/accounts/mysettings', { method: 'GET' })
}

export async function queryUserAccounts() {
  return request('/api/user/accounts', { method: 'GET' })
}

export async function createUserAccount(data: IUserAccount) {
  return request('/api/user/accounts', { method: 'POST', data })
}

export async function updateUserAccount(data: IUserAccount) {
  return request(`/api/user/accounts/${data.uuid}`, { method: 'PUT', data })
}

export async function patchUserAccount(data: IUserAccount & { new_password?: string }, patch_fields: string[]) {
  return request(`/api/user/accounts/${data.uuid}`, { method: 'PATCH', data: { data, patch_fields } })
}

export async function deleteUserAccount(uuid: string) {
  return request(`/api/user/accounts/${uuid}`, { method: 'DELETE' })
}