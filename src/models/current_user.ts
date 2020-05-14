import { Effect, Reducer } from 'umi'
import { setAuthority } from '@/utils/authority'
import { IUserAccount, queryMySettings, patchUserAccount } from '@/services/user'

export interface ICurrentUserModel {
  namespace: 'current_user'
  state: IUserAccount & { new_password?: string }
  effects: {
    query: Effect
    updateProfile: Effect
    changePassword: Effect
  }
  reducers: {
    change: Reducer<IUserAccount>
  }
}

const Model: ICurrentUserModel = {
  namespace: 'current_user',

  state: { uuid: '' },

  effects: {
    *query(_, { call, put }) {
      const res = yield call(queryMySettings)
      if (res.status === 200) {
        // 设置用户权限
        setAuthority(res.data.authority)
        yield put({ type: 'change', payload: res.data })
      }
    },
    *updateProfile({ payload: { data, patch_fields } }, { call, put }) {
      const res = yield call(patchUserAccount, data, patch_fields)
      if (res.status === 201) {
        yield put({ type: 'change', payload: res.data })
      }
    },
    *changePassword({ payload, callback }, { call }) {
      const res = yield call(patchUserAccount, payload, ['password'])
      if (res.status === 201) callback()
    },
  },

  reducers: {
    change(_, { payload }) {
      return payload
    },
  },
}

export default Model
