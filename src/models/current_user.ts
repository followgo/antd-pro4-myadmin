import { Effect, Reducer } from 'umi'
import { setAuthority } from '@/utils/authority'
import { IUserAccount, queryMySettings, patchUserAccount } from '@/services/user'

export interface ICurrentUserModel {
  namespace: 'current_user'
  state: IUserAccount & { new_password?: string }
  effects: {
    fetchMySettings: Effect
    changeMySettings: Effect
    changeMyPassword: Effect
  }
  reducers: {
    saveMySettings: Reducer<IUserAccount>
  }
}

const Model: ICurrentUserModel = {
  namespace: 'current_user',

  state: { uuid: '' },

  effects: {
    *fetchMySettings(_, { call, put }) {
      const res = yield call(queryMySettings)
      if (res.status === 200) {
        // 设置用户权限
        setAuthority(res.data.authority)
        yield put({ type: 'saveMySettings', payload: res.data })
      }
    },

    *changeMySettings({ payload: { data, patch_fields } }, { call, put }) {
      const res = yield call(patchUserAccount, data, patch_fields)
      if (res.status === 201) {
        yield put({ type: 'saveMySettings', payload: res.data })
      }
    },

    *changeMyPassword({ payload, callback }, { call }) {
      const res = yield call(patchUserAccount, payload, ['password'])
      if (res.status === 201) callback()
    },
  },

  reducers: {
    saveMySettings(_, { payload }) {
      return payload
    },
  },
}

export default Model
