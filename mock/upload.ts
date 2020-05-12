import { Request, Response } from 'express'

export default {
    // 上传 banner 文件
    'POST /api/files/banners': (req: Request, res: Response) => {
        res.status(201).send({
            status: 200,
            message: '成功',
            data: {
                uuid: '8612691e-878f-4db5-befd-476d5e313d02',
                url: 'http://www.hisilicon.com/-/media/Hisilicon/Images/Home/20180331/homebanner_kirin990_5G.jpg',
                mime_type: 'image/jpeg',
                size: 1002535,
                md5: '97027eb624f85892c69c4bcec8ab0f11',
            }
        })
    }
}