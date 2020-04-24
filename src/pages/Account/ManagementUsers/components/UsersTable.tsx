import React from 'react'
import { DownOutlined, PlusOutlined } from '@ant-design/icons'
import { Table } from 'antd'
import { connect } from 'umi'
import { ConnectState, IUserState } from '@/models/connect'

interface IManagementUsersProps {
    data: IUserState[],
    loading: boolean | undefined,
}

const UsersTable: React.FC<IManagementUsersProps> = ({ data, loading = false }) => {
    const columns = [
        { title: 'ID', dataIndex: 'uuid', key: 'uuid' },
        { title: '登陆账号', dataIndex: 'account_name', key: 'account_name' },
        { title: '邮箱', dataIndex: 'email', key: 'email' },
        { title: '绰号', dataIndex: 'nickname', key: 'nickname' },
        { title: '权限', dataIndex: 'authority', key: 'authority' },
        { title: '使能', dataIndex: 'enabled', key: 'enabled' },
    ]

    return <Table loading={loading} columns={columns} dataSource={data} />
}

export default connect(({ loading }: ConnectState) => ({
    loading: loading.models.users
}))(UsersTable)
