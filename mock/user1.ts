import { Request, Response } from 'express'
import { mock, Random } from 'mockjs'


interface IAccount {
    uuid: string,
    username: string,
    password: string,
    email?: string,
    nickname?: string,
    avatar: string,
    authority: 'admin' | 'user' | 'guest'
    enabled: boolean
}

const mockAccounts: IAccount[] = [
    {
        uuid: '8612691e-878f-4db5-befd-476d5e313d01',
        username: 'admin',
        password: 'admin',
        nickname: Random.name(),
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        email: 'admin@localhost',
        authority: 'admin',
        enabled: true
    },
    {
        uuid: '8612691e-878f-4db5-befd-476d5e313d02',
        username: 'user',
        password: 'user',
        nickname: Random.name(),
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        email: 'user@localhost',
        authority: 'user',
        enabled: true
    },
    {
        uuid: '8612691e-878f-4db5-befd-476d5e313d93',
        username: 'guest',
        password: 'guest',
        nickname: Random.name(),
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        email: 'guest@localhost',
        authority: 'guest',
        enabled: true
    },
    ...mock({
        "array|2-10": [{
            uuid: Random.guid(),
            username: Random.word(4, 10),
            password: '',
            nickname: Random.name(),
            avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
            email: Random.email(),
            'authority|1': ['admin', 'user', 'guest'],
            enabled: Random.boolean(),
        }]
    }).array
]

export default {
    // 用户登入
    'POST /user/login': (req: Request, res: Response) => {
        const { password, username } = req.body

        const existing = mockAccounts.some(value => {
            if ((value.username === username || value.email === username) &&
                value.password === password &&
                value.enabled) {
                setTimeout(() => res.status(201).send({
                    status: 201,
                    message: '成功',
                    date: {
                        uuid: value.uuid,
                        authority: value.authority,
                    }
                }), 1000)
                return true
            }
            return false
        })

        if (!existing) {
            res.status(401).send({ status: 401, message: '用户名或密码错误' })
        }
    },

    // 返回用户账户信息
    'GET /user/accounts/:uuid': (req: Request, res: Response) => {
        const uuid: string = req.param('uuid')

        const existing = mockAccounts.some(value => {
            if (value.uuid === uuid) {
                setTimeout(() => res.status(200).send({
                    status: 200,
                    message: '成功',
                    date: value,
                }), 1000)
                return true
            }

            return false
        })

        if (!existing) {
            res.status(404).send({ status: 404, message: '该用户不存在' })
        }
    },

    // 返回所有用户账户信息
    'GET /user/accounts': (req: Request, res: Response) => {
        setTimeout(() => res.status(200).send({
            status: 200,
            message: '成功',
            date: mockAccounts,
        }), 1000)
    },
}