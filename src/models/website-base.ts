import { Effect, Reducer } from 'umi'
import { IWebsiteBaseSettings, queryWebsiteBaseSettings, updateWebsiteBaseSettings } from '@/services/website-settings'

export interface IWebsiteBaseSettingsModel {
    namespace: 'website_base'
    state: IWebsiteBaseSettings | undefined
    effects: {
        fetch: Effect
        update: Effect
    }
    reducers: {
        change: Reducer<IWebsiteBaseSettings>
    }
}

const Model: IWebsiteBaseSettingsModel = {
    namespace: 'website_base',
    state: {
        global_title_suffix: ' - 三体星系',
        root_url: '',
        copyright_notice: '©2020 三体星系',
        icp_record_number: '',
        icp_record_url: '',
        head_rawcode: '',
        body_rawcode: '',
    },
    effects: {
        *fetch(_, { call, put }) {
            const res = yield call(queryWebsiteBaseSettings)
            if (res.status === 200) {
                yield put({ type: 'change', payload: res.data })
            }
        },
        *update({ payload }, { call, put }) {
            const res = yield call(updateWebsiteBaseSettings, payload)
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