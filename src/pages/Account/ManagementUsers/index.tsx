import React, { useRef, useState, useEffect } from 'react'
import { DownOutlined, PlusOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Col, Dropdown, Input, List, Menu, Modal, Progress, Radio, Row, } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import UserDefaultAvatar from '@/assets/userDefaultAvatar.png'
import { connect, Dispatch } from 'umi'
import { ConnectState, IUserState } from '@/models/connect'
import AddButton from './components/AddButton'
import UsersTable from './components/UsersTable'


interface IManagementUsersProps {
    dispatch: Dispatch
    users: IUserState[]
    loading: boolean | undefined,
}

const ManagementUsers: React.FC<IManagementUsersProps> = ({ dispatch, users, loading = false }) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [current, setCurrent] = useState<Partial<IUserState> | undefined>(undefined)

    useEffect(() => {
        dispatch({ type: 'users/fetchAllUsers' })
    }, [1])

    const showAddModal = () => {
        setVisible(true)
        setCurrent(undefined)
    };

    const showEditModal = (item: IUserState) => {
        setVisible(true)
        setCurrent(item)
    }

    return (
        <PageHeaderWrapper title={false}>
            <Card>
                <AddButton loading={loading} onClick={showAddModal} />
                <UsersTable data={users} />
            </Card>
        </PageHeaderWrapper>
    )
}

export default connect(({ users, loading }: ConnectState) => ({
    users,
    loading: loading.models.users
}))(ManagementUsers)
