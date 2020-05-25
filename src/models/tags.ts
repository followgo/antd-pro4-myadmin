import { Effect, Reducer } from 'umi'
import { ITag, queryTags, createTag, updateTag, deleteTag } from '@/services/tags'

export interface ITagState extends ITag {
    isEditing?: boolean
}

export interface ITagModel {
    namespace: 'tags',
    state: ITagState[],
    effects: {
        query: Effect,
        createItem: Effect,
        updateItem: Effect,
        deleteItem: Effect,
    },
    reducers: {
        reinitialize: Reducer<ITagState[]>
        pushItem: Reducer<ITagState[]>
        changeItem: Reducer<ITagState[]>
        removeItem: Reducer<ITagState[]>
        setEditStatus: Reducer<ITagState[]>
    },
}

const Model: ITagModel = {
    namespace: 'tags',
    state: [],
    effects: {
        *query({ callback }, { call, put }) {
            const res = yield call(queryTags)
            if (res.status === 200) {
                yield put({ type: 'reinitialize', payload: res.data })
            }
            if (callback) callback()
        },
        *createItem({ payload: { name }, callback }, { call, put }) {
            if (name) {
                const res = yield call(createTag, name)
                if (res.status === 201) {
                    yield put({ type: 'pushItem', payload: res.data })
                }
            }
            if (callback) callback()
        },
        *updateItem({ payload, callback }, { call, put }) {
            if (payload.name) {
                const res = yield call(updateTag, payload)
                if (res.status === 201) {
                    yield put({ type: 'changeItem', payload: res.data })
                }
            }
            if (callback) callback()
        },
        *deleteItem({ payload: { uuid }, callback }, { call, put }) {
            const res = yield call(deleteTag, uuid)
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
            const newState: ITagState[] = []
            if (state) newState.push(...state)
            newState.push(payload)
            return newState
        },
        changeItem(state, { payload }) {
            const newState: ITagState[] = []
            if (state) newState.push(...state)
            newState.some((value, index) => {
                if (value.uuid === payload.uuid) {
                    newState[index] = (payload as ITagState)
                    return true
                }
                return false
            })
            return newState
        },
        removeItem(state, { payload: { uuid } }) {
            let newState: ITagState[] = []
            if (state) newState = [...state]
            return newState.filter(value => value.uuid !== uuid)
        },
        setEditStatus(state, { payload: { uuid, isEditing } }) {
            let newState: ITagState[] = []
            if (state) newState = [...state]

            newState.some((value, index) => {
                if (value.uuid === uuid) {
                    newState[index].isEditing = isEditing
                    return true
                }
                return false
            })

            return newState
        },
    },
}

export default Model