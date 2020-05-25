import { Request, Response } from 'express'
import Mock, { Random } from 'mockjs'
import { ITag } from '@/services/tags'

let mockTags: ITag[] = [...Mock.mock({
    'array|3-20': [{
        uuid: '@guid()',
        name: '@ctitle(2, 7)',
    }]
}).array]

export default {
    'GET /api/tags': (_req: Request, res: Response) => {
        setTimeout(() => res.status(200).send({
            status: 200,
            message: '成功',
            data: mockTags,
        }), 500)
    },

    'POST /api/tags': (req: Request, res: Response) => {
        const { name } = req.body
        const uuid = Random.guid()
        mockTags.push({ uuid, name })

        setTimeout(() => res.status(201).send({
            status: 201,
            message: '成功',
            data: { uuid, name },
        }), 100)
    },

    'PUT /api/tags/:uuid': (req: Request, res: Response) => {
        const { uuid } = req.params
        const {name} = req.body

        const existing = mockTags.some((item, index) => {
            if (item.uuid === uuid) {
                mockTags[index] = { uuid, name }
                res.status(201).send({ status: 201, message: '成功', data: { uuid, name } })
                return true
            }
            return false
        })

        if (!existing) res.status(404).send({ status: 404, message: '该资源不存在' })
    },

    'DELETE /api/tags/:uuid': (req: Request, res: Response) => {
        const { uuid } = req.params
        mockTags = mockTags.filter(item => item.uuid !== uuid)
        res.status(204).send({ status: 204, message: '成功' })
    },
}