import { Effect, Reducer } from 'umi'
import { queryUserAccounts, IUserAccount, patchUserAccount, deleteUserAccount, createUserAccount } from '@/services/user'

export interface IManagementUsersModel {
    namespace: 'users'
    state: IUserAccount[]
    effects: {
        query: Effect
        createItem: Effect
        patchItem: Effect
        deleteItem: Effect
    }
    reducers: {
        reinitialize: Reducer<IUserAccount[]>
        pushItem: Reducer<IUserAccount[]>
        changeItem: Reducer<IUserAccount[]>
        removeItem: Reducer<IUserAccount[]>
    }
}

const Model: IManagementUsersModel = {
    namespace: 'users',
    state: [],
    effects: {
        *query(_, { call, put }) {
            const res = yield call(queryUserAccounts)
            if (res.status === 200) {
                yield put({ type: 'reinitialize', payload: res.data })
            }
        },
        *createItem({ payload, callback }, { call, put }) {
            const res = yield call(createUserAccount, payload)
            if (res.status === 201) {
                yield put({ type: 'pushItem', payload: res.data })
            }
            if (callback) callback()
        },
        *patchItem({ payload: { data, patch_fields }, callback }, { call, put }) {
            const res = yield call(patchUserAccount, data, patch_fields)
            if (res.status === 201) {
                yield put({ type: 'changeItem', payload: res.data })
            }
            if (callback) callback()
        },
        *deleteItem({ payload: { uuid } }, { call, put }) {
            const res = yield call(deleteUserAccount, uuid)
            if (!res) { // 204 返回，res 为空
                yield put({ type: 'removeItem', payload: { uuid } })
            }
        },
    },
    reducers: {
        reinitialize(_, { payload }) {
            return payload
        },
        pushItem(state, { payload }) {
            const newState: IUserAccount[] = []
            if (state) newState.push(...state)
            newState.push(payload)
            return newState
        },
        changeItem(state, { payload }) {
            const newState: IUserAccount[] = []
            if (state) newState.push(...state)
            newState.some((value, index) => {
                if (value.uuid === payload.uuid) {
                    newState[index] = (payload as IUserAccount)
                    return true
                }
                return false
            })
            return newState
        },
        removeItem(state, { payload: { uuid } }) {
            let newState: IUserAccount[] = []
            if (state) newState = [...state]
            return newState.filter(value => value.uuid !== uuid)
        },
    }

}

export default Model