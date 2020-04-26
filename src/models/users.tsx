import { Effect, Reducer } from 'umi'
import { queryUserAccounts, IUserAccount, patchUserAccount, deleteUserAccount, createUserAccount } from '@/services/user'
import { IUserState } from './connect'

export interface IManagementUsersModel {
    namespace: 'users'
    state: IUserAccount[]
    effects: {
        fetchAllUsers: Effect
        changeUser: Effect
        createUser: Effect
        deleteUser: Effect
    }
    reducers: {
        fetchAll: Reducer<IUserAccount[]>
        update: Reducer<IUserAccount[]>
        add: Reducer<IUserAccount[]>
        delete: Reducer<IUserAccount[]>
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
        *changeUser({ payload: { data, patch_fields }, callback }, { call, put }) {
            const res = yield call(patchUserAccount, data, patch_fields)
            if (res.status === 201) {
                yield put({ type: 'update', payload: res.data })
            }
            if (callback) callback()
        },
        *deleteUser({ payload: { uuid } }, { call, put }) {
            const res = yield call(deleteUserAccount, uuid)
            if (!res) { // 204 返回，res 为空
                yield put({ type: 'delete', payload: { uuid } })
            }
        },
        *createUser({ payload, callback }, { call, put }) {
            const res = yield call(createUserAccount, payload)
            if (res.status === 201) {
                yield put({ type: 'add', payload: res.data })
            }
            if (callback) callback()
        }
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
        delete(state, { payload: { uuid } }) {
            let newState: IUserAccount[] = []
            if (state) newState = [...state]
            return newState.filter(value => value.uuid !== uuid)
        },
        add(state, { payload }) {
            const newState: IUserAccount[] = []
            if (state) newState.push(...state)
            newState.push(payload)
            return newState
        }
    }

}

export default Model