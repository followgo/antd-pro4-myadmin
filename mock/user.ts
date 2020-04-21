import { Request, Response } from 'express'
import { mock, Random } from 'mockjs'
import { IUserAccount } from '@/services/user'

let mockAccounts: IUserAccount[] = [
    {
        uuid: '8612691e-878f-4db5-befd-476d5e313d01',
        username: 'admin',
        password: 'admin',
        nickname: Random.name(),
        email: 'admin@localhost',
        authority: 'admin',
        enabled: true
    },
    {
        uuid: '8612691e-878f-4db5-befd-476d5e313d02',
        username: 'user',
        password: 'user',
        nickname: Random.name(),
        email: 'user@localhost',
        authority: 'user',
        enabled: true
    },
    {
        uuid: '8612691e-878f-4db5-befd-476d5e313d93',
        username: 'guest',
        password: 'guest',
        nickname: Random.name(),
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
            email: Random.email(),
            'authority|1': ['admin', 'user', 'guest'],
            enabled: Random.boolean(),
        }]
    }).array
]

let currentUserUUID: string = ''

export default {
    // 用户登入
    'POST /user/login/account': (req: Request, res: Response) => {
        const { password, username } = req.body

        const existing = mockAccounts.some(value => {
            if ((value.username === username || value.email === username) &&
                value.password === password && value.enabled) {
                currentUserUUID = value.uuid

                // 当返回访问令牌时，HTTP服务器必须在HTTP头信息中增加两个属性，确保客户端不缓存返回结果。
                res.setHeader('Cache-Control', 'no-store')
                res.setHeader('Pragma', 'no-store')

                setTimeout(() => res.status(201).send({
                    status: 201,
                    message: '成功',
                    data: {
                        access_token: 'mock-access_token--9DAAJGfNWkHE81mpnR3gXzfrBAB3WUAg',
                        token_type: 'Bearer',
                        expires_in: 3600,
                        refresh_token: 'mock-refresh_token-eyJhbGciOiJIUzUxMiJ9',
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

    // 刷新token
    'POST /user/refresh_token': (req: Request, res: Response) => {
        res.status(201).send({
            status: 201,
            message: '成功',
            data: {
                access_token: 'mock-access_token--9DAAJGfNWkHE81mpnR3gXzfrBAB3WUAg',
                token_type: 'Bearer',
                expires_in: 3600,
            }
        })
    },

    // 用户登出
    'POST /user/logout': (req: Request, res: Response) => {
        res.status(201).send({ status: 201, message: '成功' })
    },

    // 返回用户账户信息
    'GET /user/accounts/mysettings': (req: Request, res: Response) => {
        const existing = mockAccounts.some(value => {
            if (value.uuid === currentUserUUID) {
                setTimeout(() => res.status(200).send({
                    status: 200,
                    message: '成功',
                    data: value,
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
            data: mockAccounts,
        }), 1000)
    },

    // 添加
    'POST /user/accounts': (req: Request, res: Response) => {
        const data: IUserAccount = req.body
        data.uuid = Random.guid()
        res.status(201).send({ status: 201, message: '成功', data })
    },

    // 替换
    'PUT /user/accounts/:uuid': (req: Request, res: Response) => {
        const uuid: string = req.param('uuid')
        const data: IUserAccount = req.body
        data.uuid = uuid

        const existing = mockAccounts.some((value, index) => {
            if (value.uuid === uuid) {
                mockAccounts[index] = data
                setTimeout(() => res.status(201).send({
                    status: 201,
                    message: '成功',
                    data: mockAccounts[index],
                }), 1000)
                return true
            }
            return false
        })

        if (!existing) {
            res.status(404).send({ status: 404, message: '该用户不存在' })
        }
    },

    // 修补
    'PATCH /user/accounts/:uuid': (req: Request, res: Response) => {
        const uuid: string = req.param('uuid')
        const { data, patch_fields } = req.body

        const existing = mockAccounts.some((value, index) => {
            if (value.uuid === uuid) {
                (patch_fields as string[]).forEach(field => {
                    mockAccounts[index][field] = (data as IUserAccount)[field]
                })

                setTimeout(() => res.status(201).send({
                    status: 201,
                    message: '成功',
                    data: mockAccounts[index],
                }), 1000)
                return true
            }
            return false
        })

        if (!existing) {
            res.status(404).send({ status: 404, message: '该用户不存在' })
        }
    },

    // 删除
    'DELETE /user/accounts/:uuid': (req: Request, res: Response) => {
        const uuid: string = req.param('uuid')

        mockAccounts = mockAccounts.filter(value => value.uuid !== uuid)
        res.status(204).send({ status: 204, message: '成功' })
    },
}