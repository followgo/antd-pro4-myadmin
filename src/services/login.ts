import request from '@/utils/request';

export interface LoginParamsType {
  username: string
  password: string
  type: string
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  })
}