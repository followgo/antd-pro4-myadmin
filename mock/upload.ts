import { Request, Response } from 'express'
import { Random } from 'mockjs'

export default {
    // 上传 banner 文件
    'POST /api/files/banners': (req: Request, res: Response) => {
        const uuid = Random.guid()
        res.status(201).send({
            status: 200,
            message: '成功',
            data: {
                uuid,
                url: `/static/images/${uuid}`,
                mime_type: 'image/jpeg',
                size: 1002535,
                md5: '97027eb624f85892c69c4bcec8ab0f11',
            }
        })
    },

    // 下载
    'GET /static/files/:uuid': (req: Request, res: Response) => {
        const fName = Random.pick(['1.jpg', '2.jpg', '3.jpg', '4.jpg'])
        res.sendFile(`${process.cwd()}/mock/showgirls/${fName}`)
    },

    'GET /static/images/:uuid': (req: Request, res: Response) => {
        const fName = Random.pick(['1.jpg', '2.jpg', '3.jpg', '4.jpg'])
        res.sendFile(`${process.cwd()}/mock/showgirls/${fName}`)
    },
}