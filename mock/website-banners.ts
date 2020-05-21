import { Request, Response } from 'express'
import { IWebsiteBanner } from '@/services/website-banners'
import { Random } from 'mockjs'

let mockBanners: IWebsiteBanner[] = [
    {
        uuid: Random.guid(),
        picture_uuid: Random.guid(),
        picture_url: '/static/images/613d614b-db91-4367-8967-357df9201c62',
        target_url: 'http://localhost:8000/',
        title: 'Ant Design Pro',
        description: '基于 Ant Design 设计体系的 React UI 组件库，用于研发企业级中后台产品。',
        purpose: 'index',
        sort_number: 100,
        enabled: true,
    },
    {
        uuid: Random.guid(),
        picture_uuid: Random.guid(),
        picture_url: '/static/images/1f7cf093-03c9-4f0b-9f83-75d04b5ceb2e',
        target_url: 'http://localhost:8000/',
        title: 'DvaJS',
        description: 'dva 首先是一个基于 redux 和 redux-saga 的数据流方案，然后为了简化开发体验，dva 还额外内置了 react-router 和 fetch ，所以也可以理解为一个轻量级的应用框架。',
        purpose: 'index',
        sort_number: 99,
        enabled: true,
    }
]


export default {
    'GET /api/website/banners': (req: Request, res: Response) => {
        const { purpose = 'index' } = req.query
        res.status(200).send({
            status: 200,
            message: '成功',
            data: mockBanners.filter(item => item.purpose === purpose)
        })
    },

    'POST /api/website/banners': (req: Request, res: Response) => {
        const data = req.body
        data.uuid = Random.guid()
        data.picture_url= `/static/images/${data.uuid}`
        mockBanners.push(data)
        res.status(201).send({ status: 201, message: '成功', data })
    },

    'PUT /api/website/banners/:uuid': (req: Request, res: Response) => {
        const { uuid } = req.params
        const data = req.body
        data.uuid = uuid

        const existing = mockBanners.some((item, index) => {
            if (item.uuid === uuid) {
                data.picture_url= `/static/images/${data.uuid}`
                mockBanners[index] = data
                res.status(201).send({ status: 201, message: '成功', data })
                return true
            }
            return false
        })

        if (!existing) res.status(404).send({ status: 404, message: '该资源不存在' })
    },

    'PATCH /api/website/banners/:uuid': (req: Request, res: Response) => {
        const { uuid } = req.params
        const { data, patch_fields } = req.body

        const existing = mockBanners.some((item, index) => {
            if (item.uuid === uuid) {
                (patch_fields as string[]).map(field => {
                    mockBanners[index][field] = data[field]
                    return true
                })
                res.status(201).send({ status: 201, message: '成功', data })
                return true
            }
            return false
        })

        if (!existing) res.status(404).send({ status: 404, message: '该资源不存在' })
    },

    'DELETE /api/website/banners/:uuid': (req: Request, res: Response) => {
        const { uuid } = req.params
        mockBanners = mockBanners.filter(item => item.uuid !== uuid)
        res.status(204).send({ status: 204, message: '成功' })
    },
}