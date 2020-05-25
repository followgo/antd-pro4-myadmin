import { Effect, Reducer } from 'umi'
import { IWebsiteBanner, queryWebsiteBanners, createWebsiteBanner, updateWebsiteBanner, patchWebsiteBanner, deleteWebsiteBanner } from '@/services/website-banners'

export interface IWebsiteBannersModel {
    namespace: 'website_banners'
    state: IWebsiteBanner[]
    effects: {
        query: Effect,
        updateItem: Effect,
        patchItem: Effect,
        createItem: Effect,
        deleteItem: Effect,
    },
    reducers: {
        reinitialize: Reducer<IWebsiteBanner[]>
        pushItem: Reducer<IWebsiteBanner[]>
        changeItem: Reducer<IWebsiteBanner[]>
        removeItem: Reducer<IWebsiteBanner[]>
    }
}

const Model: IWebsiteBannersModel = {
    namespace: 'website_banners',
    state: [],
    effects: {
        *query({ callback }, { call, put }) {
            const res = yield call(queryWebsiteBanners)
            if (res.status === 200) {
                yield put({ type: 'reinitialize', payload: res.data })
            }
            if (callback) callback()
        },
        *updateItem({ payload, callback }, { call, put }) {
            const res = yield call(updateWebsiteBanner, payload)
            if (res.status === 201) {
                yield put({ type: 'changeItem', payload: res.data })
            }
            if (callback) callback()
        },
        *patchItem({ payload: { data, patch_fields }, callback }, { call, put }) {
            const res = yield call(patchWebsiteBanner, data, patch_fields)
            if (res.status === 201) {
                yield put({ type: 'changeItem', payload: res.data })
            }
            if (callback) callback()
        },
        *createItem({ payload, callback }, { call, put }) {
            const res = yield call(createWebsiteBanner, payload)
            if (res.status === 201) {
                yield put({ type: 'pushItem', payload: res.data })
            }
            if (callback) callback()
        },
        *deleteItem({ payload: { uuid }, callback }, { call, put }) {
            const res = yield call(deleteWebsiteBanner, uuid)
            if (!res) { // 204 返回，res 为空
                yield put({ type: 'removeItem', payload: { uuid } })
            }
            if (callback) callback()
        },
    },
    reducers: {
        reinitialize(_, { payload }) {
            return payload
        },
        pushItem(state, { payload }) {
            const newState: IWebsiteBanner[] = []
            if (state) newState.push(...state)
            newState.push(payload)
            return newState
        },
        changeItem(state, { payload }) {
            const newState: IWebsiteBanner[] = []
            if (state) newState.push(...state)
            newState.some((value, index) => {
                if (value.uuid === payload.uuid) {
                    newState[index] = (payload as IWebsiteBanner)
                    return true
                }
                return false
            })
            return newState
        },
        removeItem(state, { payload: { uuid } }) {
            let newState: IWebsiteBanner[] = []
            if (state) newState = [...state]
            return newState.filter(value => value.uuid !== uuid)
        }

    }
}

export default Model