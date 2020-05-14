import { Request, Response } from 'express'
import { Random } from 'mockjs'
import { IUserAccount } from '@/services/user'

let mockAccounts: IUserAccount[] = [
    {
        uuid: '1e07ee4c-ade9-4b6b-91ed-d0e5d7ee7431',
        account_name: 'admin',
        password: 'admin',
        nickname: Random.name(),
        email: 'admin@localhost.local',
        authority: 'admin',
        enabled: true
    },
    {
        uuid: '685cee85-5c08-4f8a-ade3-b9113af47d8c',
        account_name: 'user',
        password: 'user',
        nickname: Random.name(),
        email: 'user@localhost.local',
        authority: 'user',
        enabled: true
    },
    {
        uuid: '73a7597d-3d7b-4851-aa34-1403489a6e47',
        account_name: 'guest',
        password: 'guest',
        nickname: Random.name(),
        email: 'guest@localhost.local',
        authority: 'guest',
        enabled: false
    },
]

let currentUserUUID: string = ''

export default {
    // 用户登入
    'POST /api/user/login/account': (req: Request, res: Response) => {
        const { password, name_or_email } = req.body

        const existing = mockAccounts.some(value => {
            if ((value.account_name === name_or_email || value.email === name_or_email) &&
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
    'GET /api/user/refresh_token': (_req: Request, res: Response) => {
        res.status(200).send({
            status: 200,
            message: '成功',
            data: {
                access_token: 'mock-access_token--9DAAJGfNWkHE81mpnR3gXzfrBAB3WUAg',
                token_type: 'Bearer',
                expires_in: 3600,
            }
        })
    },

    // 用户登出
    'POST /api/user/logout': (req: Request, res: Response) => {
        res.status(201).send({ status: 201, message: '成功' })
    },

    // 返回用户账号信息
    'GET /api/user/accounts/mysettings': (req: Request, res: Response) => {
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

    // 返回所有用户账号信息
    'GET /api/user/accounts': (req: Request, res: Response) => {
        setTimeout(() => res.status(200).send({
            status: 200,
            message: '成功',
            data: mockAccounts,
        }), 500)
    },

    // 添加
    'POST /api/user/accounts': (req: Request, res: Response) => {
        const data = req.body
        data.uuid = Random.guid()
        mockAccounts.push(data)
        res.status(201).send({ status: 201, message: '成功', data })
    },

    // 替换
    'PUT /api/user/accounts/:uuid': (req: Request, res: Response) => {
        const { uuid } = req.params
        const data = req.body
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

        if (!existing) res.status(404).send({ status: 404, message: '该用户不存在' })
    },

    // 修补
    'PATCH /api/user/accounts/:uuid': (req: Request, res: Response) => {
        const { uuid } = req.params
        const { data, patch_fields } = req.body

        const patchData: IUserAccount & { new_password?: string } = (data as IUserAccount)
        let resp: { status: number, message: string, data?: IUserAccount } = { status: 0, message: '' }
        const existing = mockAccounts.some((value, index) => {
            if (value.uuid === uuid) {
                (patch_fields as string[]).some(field => {

                    // 修改密码
                    if (field === 'password' && patchData.new_password) {
                        if (mockAccounts[index][field] !== patchData[field]) {
                            resp = { status: 400, message: '当前密码不正确' }
                            return true
                        }

                        mockAccounts[index][field] = patchData.new_password
                        return false
                    }

                    // 修改其它属性
                    mockAccounts[index][field] = patchData[field]
                    return false
                })

                if (resp.status === 0) {
                    resp = { status: 201, message: '成功', data: mockAccounts[index] }
                }
                return true
            }
            return false
        })
        if (!existing) {
            resp = { status: 404, message: '该用户不存在' }
        }

        setTimeout(() => res.status(resp.status).send(resp), 1000)
    },

    // 删除
    'DELETE /api/user/accounts/:uuid': (req: Request, res: Response) => {
        const { uuid } = req.params

        mockAccounts = mockAccounts.filter(value => value.uuid !== uuid)
        res.status(204).send()
    },
}