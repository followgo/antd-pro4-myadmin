import request from '@/utils/request'

export interface IWebsiteBanner {
    uuid: string
    picture_uuid: string
    picture_url?: string
    target_url: string
    title: string
    description: string
    purpose: 'index' | 'other'
    sort_number: number
    enabled: boolean
}

export async function queryWebsiteBanners() {
    return request('/api/website/banners', { method: 'GET' })
}

export async function createWebsiteBanner(data: IWebsiteBanner) {
    return request('/api/website/banners', { method: 'POST', data })
}

export async function updateWebsiteBanner(data: IWebsiteBanner) {
    return request(`/api/website/banners/${data.uuid}`, { method: 'PUT', data })
}

export async function patchWebsiteBanner(data: IWebsiteBanner, patch_fields: string[]) {
    return request(`/api/website/banners/${data.uuid}`, { method: 'PATCH', data: { data, patch_fields } })
}

export async function deleteWebsiteBanner(uuid: string) {
    return request(`/api/website/banners/${uuid}`, { method: 'DELETE' })
}