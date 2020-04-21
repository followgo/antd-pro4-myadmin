import { stringify } from 'querystring'
import { history, Reducer, Effect } from 'umi'
import { loginByAccount, logout } from '@/services/user'
import { getPageQuery } from '@/utils/utils'

export interface ILoginState {
  login_type: string
  login_status: 'ok' | 'aborted' | 'void'
  access_token?: string
  token_type?: string
  refresh_token?: string
}

export interface ILoginModel {
  namespace: 'login'
  state: ILoginState
  effects: {
    loginByAccount: Effect
    logout: Effect
  }
  reducers: {
    changeLoginStatus: Reducer
    clearLoginStatus: Reducer
  }
}

const Model: ILoginModel = {
  namespace: 'login',

  state: { login_type: 'account', login_status: 'void' },

  effects: {
    *loginByAccount({ payload }, { call, put }) {
      const res = yield call(loginByAccount, payload)

      if (res.status === 201) {
        yield put({ type: 'changeLoginStatus', payload: { ...res.data, login_type: 'account', login_status: 'ok' } })

        const urlParams = new URL(window.location.href)
        const params = getPageQuery()
        let { redirect } = params as { redirect: string }

        if (redirect) {
          const redirectUrlParams = new URL(redirect)
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length)
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1)
            }
          } else {
            window.location.href = '/'
            return;
          }
        }
        history.replace(redirect || '/')

      } else {
        yield put({
          type: 'changeLoginStatus', payload: {
            login_type: 'account',
            login_status: 'aborted',
            access_token: '', token_type: '', refresh_token: ''
          }
        })
      }
    },

    *logout(_, { call, put }) {
      yield call(logout)
      put({ type: 'clearLoginStatus' })

      const { redirect } = getPageQuery();
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({ redirect: window.location.href }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }): ILoginState {
      const { access_token, token_type, refresh_token, login_type, login_status } = payload
      sessionStorage.setItem('access_token', access_token)
      sessionStorage.setItem('token_type', token_type)
      sessionStorage.setItem('refresh_token', refresh_token)

      return {
        ...state,
        access_token, token_type, refresh_token, login_type, login_status
      }
    },

    clearLoginStatus(): ILoginState {
      sessionStorage.removeItem('access_token')
      sessionStorage.removeItem('token_type')
      sessionStorage.removeItem('refresh_token')
      return { login_type: 'account', login_status: 'void' }
    }
  },
};

export default Model