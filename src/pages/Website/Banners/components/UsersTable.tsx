import React, { useEffect } from 'react'
import { CloseOutlined, CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Table, Tag, Popconfirm, Button } from 'antd'
import { connect, Dispatch } from 'umi'
import { ConnectState, IUserState } from '@/models/connect'

interface IManagementUsersProps {
    dispatch: Dispatch
    users: IUserState[]
    onShowEditModal: (data: IUserState) => void
    loading?: boolean
    changing?: boolean
    deleting?: boolean
}

const UsersTable: React.FC<IManagementUsersProps> = ({ dispatch, users, onShowEditModal, loading = false, changing = false, deleting = false }) => {
    useEffect(() => {
        dispatch({ type: 'users/fetchAllUsers' })
    }, [])

    const handleToggleEnable = (item: IUserState) => {
        dispatch({ type: 'users/changeUser', payload: { data: { ...item, enabled: !item.enabled }, patch_fields: ['enabled'] } })
    }

    const handleDelete = (item: IUserState) => {
        dispatch({ type: 'users/deleteUser', payload: { uuid: item.uuid } })
    }

    const columns = [
        // { title: 'ID', dataIndex: 'uuid', key: 'uuid' },
        { title: '登陆账号', dataIndex: 'account_name', key: 'account_name' },
        { title: '邮箱', dataIndex: 'email', key: 'email' },
        { title: '绰号', dataIndex: 'nickname', key: 'nickname' },
        {
            title: '权限', key: 'authority', render: (_: any, record: IUserState) => {
                let color: string = ''
                if (record.authority === 'admin') {
                    color = 'volcano'
                } else if (record.authority === 'user') {
                    color = 'geekblue'
                } else {
                    color = 'green'
                }
                return <Tag color={color} key={record.uuid} > {record.authority?.toUpperCase()} </Tag>
            }
        },
        {
            title: '使能', key: 'enabled', render: (_: any, record: IUserState) => {
                const status = record.enabled
                return (
                    <Popconfirm onConfirm={() => handleToggleEnable(record)} title={status ? '去使能此用户？' : '使能此用户？'}>
                        <Button loading={changing} type='link' danger={!status} icon={status ? <CheckOutlined /> : <CloseOutlined />} />
                    </Popconfirm>
                )
            }
        },
        {
            title: '行动', key: 'action', render: (_: any, record: IUserState) => {
                return (
                    <>
                        <Button onClick={() => onShowEditModal(record)} size="small" icon={<EditOutlined />} style={{ marginRight: 10 }} />
                        <Popconfirm onConfirm={() => handleDelete(record)} title='删除此用户？'>
                            <Button loading={deleting} size="small" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </>
                )
            }
        }
    ]

    return <Table
        pagination={false}
        loading={loading}
        columns={columns}
        dataSource={users}
        rowKey={record => record.uuid}
    />
}

export default connect(({ users, loading }: ConnectState) => ({
    users,
    loading: loading.effects['users/fetchAllUsers'],
    changing: loading.effects['users/changeUser'],
    deleting: loading.effects['users/deleteUser'],
}))(UsersTable)


