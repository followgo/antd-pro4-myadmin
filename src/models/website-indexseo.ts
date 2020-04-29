import { Effect, Reducer } from 'umi'
import { IWebsiteIndexSEO, queryWebsiteIndexSEO, updateWebsiteIndexSEO } from '@/services/website-settings'

export interface IWebsiteBaseSettingsModel {
    namespace: 'website_indexseo'
    state: IWebsiteIndexSEO | undefined
    effects: {
        fetch: Effect
        update: Effect
    }
    reducers: {
        change: Reducer<IWebsiteIndexSEO>
    }
}

const Model: IWebsiteBaseSettingsModel = {
    namespace: 'website_indexseo',
    state: { title: '', keywords: '', description: '' },
    effects: {
        *fetch(_, { call, put }) {
            const res = yield call(queryWebsiteIndexSEO)
            if (res.status === 200) {
                yield put({ type: 'change', payload: res.data })
            }
        },
        *update({ payload }, { call, put }) {
            const res = yield call(updateWebsiteIndexSEO, payload)
            if (res.status === 201) {
                yield put({ type: 'change', payload: res.data })
            }
        }
    },
    reducers: {
        change(_, { payload }) { return payload },
    },
}

export default Model