import { Effect, Reducer } from 'umi'
import { queryUserAccounts, IUserAccount } from '@/services/user'

export interface IManagementUsersModel {
    namespace: 'users'
    state: IUserAccount[]
    effects: {
        fetchAllUsers: Effect
        // createUser: Effect
        // updateUser: Effect
        // deleteUser: Effect
    }
    reducers: {
        add: Reducer<IUserAccount[]>
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
                yield put({ type: 'add', payload: res.data })
            }
        }
    },
    reducers: {
        add(state, { payload }): IUserAccount[] {
            let newState: IUserAccount[] = payload
            if (state) newState = { ...state }

            return newState
        }
    }

}

export default Model