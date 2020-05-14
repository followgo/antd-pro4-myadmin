import request from '@/utils/request'

export interface IWebsiteBanner {
    uuid: string
    picture_uuid: string
    target_url: string
    title: string
    description: string
    purpose: 'index' | 'other'
}

export async function queryWebsiteBanners() {
    return request('/api/website/banners', { method: 'GET' })
}

export async function createWebsiteBanners(data: IWebsiteBanner) {
    return request('/api/website/banners', { method: 'POST', data })
}

export async function updateWebsiteBanners(data: IWebsiteBanner) {
    return request(`/api/website/banners/${data.uuid}`, { method: 'PUT', data })
}

export async function patchWebsiteBanners(data: IWebsiteBanner, patch_fields: string[]) {
    return request(`/api/website/banners/${data.uuid}`, { method: 'POST', data: { data, patch_fields } })
}

export async function deleteWebsiteBanners(uuid: string) {
    return request(`/api/website/banners/${uuid}`, { method: 'DELETE' })
}