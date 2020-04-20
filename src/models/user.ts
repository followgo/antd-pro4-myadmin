import { Effect, Reducer } from 'umi'
import { setAuthority } from '@/utils/authority'
import { IUserAccount, queryMySettings } from '@/services/user'

export interface IUserModelState extends IUserAccount { }

export interface IUserModel {
  namespace: 'user'
  state: IUserModelState | {}
  effects: {
    fetchMySettings: Effect
  }
  reducers: {
    saveMySettings: Reducer<IUserModelState>
  }
}

const Model: IUserModel = {
  namespace: 'user',

  state: {},

  effects: {
    *fetchMySettings(_, { call, put }) {
      const res = yield call(queryMySettings)
      if (res.status === 200) {
        // 设置用户权限
        setAuthority(res.data.authority)
        yield put({ type: 'saveMySettings', payload: res.data })
      }
    },
  },

  reducers: {
    saveMySettings(_, { payload }) {
      return payload
    },
  },
}

export default Model
