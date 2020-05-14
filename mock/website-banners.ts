import { Request, Response } from 'express'
import { IWebsiteBanner } from '@/services/website-banners'
import { Random } from 'mockjs'

let mockBanners: IWebsiteBanner[] = [
    {
        uuid: '5c95ef18-c2c2-47c9-9fb3-f093b7f9663b',
        picture_uuid: '613d614b-db91-4367-8967-357df9201c62',
        target_url: 'http://localhost:8000/',
        title: '企业级产品设计体系，创造高效愉悦的工作体验',
        description: '基于 Ant Design 设计体系的 React UI 组件库，用于研发企业级中后台产品。',
        purpose: 'index',
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
        mockBanners.push(data)
        res.status(201).send({ status: 201, message: '成功', data })
    },

    'PUT /api/website/banners/:uuid': (req: Request, res: Response) => {
        const { uuid } = req.params
        const data = req.body
        data.uuid = uuid

        const existing = mockBanners.some((item, index) => {
            if (item.uuid === uuid) {
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