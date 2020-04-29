import { Request, Response } from 'express'
import { IWebsiteBaseSettings, IWebsiteIndexSEO } from '@/services/website-settings'

let websiteBaseSettings: IWebsiteBaseSettings = {
    global_title_suffix: ' - 三体星系',
    root_url: '',
    copyright_notice: '©2020 三体星系',
    icp_record_number: '三体ICP备00000001号',
    icp_record_url: 'http://www.beian.santi',
    head_rawcode: '',
    body_rawcode: '',
}

let indexSEO: IWebsiteIndexSEO = { title: '首页', keywords: '', description: '' }

export default {
    'GET /api/website/base_settings': (_req: Request, res: Response) => {
        setTimeout(() => res.status(200).send({
            status: 200, message: '成功', data: websiteBaseSettings,
        }), 500)
    },
    'PUT /api/website/base_settings': (req: Request, res: Response) => {
        websiteBaseSettings = req.body
        setTimeout(() => res.status(201).send({
            status: 201, message: '成功', websiteBaseSettings,
        }), 1000)
    },
    'GET /api/website/index_seo': (_req: Request, res: Response) => {
        setTimeout(() => res.status(200).send({
            status: 200, message: '成功', data: indexSEO,
        }), 500)
    },
    'PUT /api/website/index_seo': (req: Request, res: Response) => {
        indexSEO = req.body
        setTimeout(() => res.status(201).send({
            status: 201, message: '成功', indexSEO,
        }), 1000)
    },
}