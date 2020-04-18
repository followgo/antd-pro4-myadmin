import request from 'umi-request';

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function query() {
  return request('/api/users');
}
