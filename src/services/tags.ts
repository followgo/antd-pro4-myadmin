import request from '@/utils/request'

export interface ITag {
    uuid: string
    name: string
}

export async function queryTags() {
    return request('/api/tags', { method: 'GET' })
}

export async function createTag(name: string) {
    return request('/api/tags', { method: 'POST', data: { name } })
}

export async function updateTag(tag: ITag) {
    return request(`/api/tags/${tag.uuid}`, { method: 'PUT', data: tag })
}

export async function deleteTag(tag: ITag) {
    return request(`/api/tags/${tag.uuid}`, { method: 'DELETE' })
}