import { Effect, Reducer } from 'umi'
import { queryUserAccounts, IUserAccount, patchUserAccount } from '@/services/user'
import { IUserState } from './connect'

export interface IManagementUsersModel {
    namespace: 'users'
    state: IUserAccount[]
    effects: {
        fetchAllUsers: Effect
        changeUser: Effect
        // createUser: Effect
        // updateUser: Effect
        // deleteUser: Effect
    }
    reducers: {
        fetchAll: Reducer<IUserAccount[]>
        update: Reducer<IUserAccount[]>
        push: Reducer<IUserAccount[]>
        // change: Reducer<IUserAccount>
        // delete: Reducer<IUserAccount>
    }
}

const Model: IManagementUsersModel = {
    namespace: 'users',
    state: [],
    effects: {
        *fetchAllUsers(_, { call, put }) {
            const res = yield call(queryUserAccounts)
            if (res.status === 200) {
                yield put({ type: 'fetchAll', payload: res.data })
            }
        },
        *changeUser({ payload: { data, patch_fields } }, { call, put }) {
            const res = yield call(patchUserAccount, data, patch_fields)
            if (res.status === 201) {
                yield put({ type: 'update', payload: res.data })
            }
        },
    },
    reducers: {
        fetchAll(_, { payload }) {
            return payload
        },
        update(state, { payload }) {
            const newState: IUserAccount[] = []
            if (state) newState.push(...state)
            newState.some((value, index) => {
                if (value.uuid === payload.uuid) {
                    newState[index] = (payload as IUserState)
                    return true
                }
                return false
            })

            return newState
        },
        push(state, { payload }) {
            const newState: IUserAccount[] = []
            if (state) newState.push(...state)
            newState.push(...payload)
            return newState
        }
    }

}

export default Model