import request from '@/utils/request'
import { RcFile } from 'antd/lib/upload/interface'

export interface IUploadFileInfo {
    uuid: string
    url: string
    mime_type?: string
    size?: number
    md5?: string
}

export async function uploadBannerFile(file: File, fileMd5: string) {
    const fd = new FormData()
    fd.append('md5', fileMd5)
    fd.append('file', file)

    return request('/api/files/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: fd,
    })
}