import request from '@/utils/request'

export interface IWebsiteBaseSettings {
    global_title_suffix: string
    root_url: string
    copyright_notice: string
    icp_record_number: string
    icp_record_url: string
    head_rawcode: string
    body_rawcode: string
}

export interface IWebsiteIndexSEO {
    title: string
    keywords: string
    description: string
}

export async function queryWebsiteBaseSettings() {
    return request('/api/website/base_settings', { method: 'GET' })
}

export async function updateWebsiteBaseSettings(data: IWebsiteBaseSettings) {
    return request('/api/website/base_settings', { method: 'PUT', data })
}

export async function queryWebsiteIndexSEO() {
    return request('/api/website/index_seo', { method: 'GET' })
}

export async function updateWebsiteIndexSEO(data: IWebsiteBaseSettings) {
    return request('/api/website/index_seo', { method: 'PUT', data })
}