import React, { useState } from 'react'
import { Card } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { IUserState } from '@/models/connect'
import AddButton from './components/AddButton'
import UsersTable from './components/UsersTable'
import OpModal from './components/OpModal'


interface IManagementUsersProps {

}

const ManagementUsers: React.FC<IManagementUsersProps> = () => {
    const [visible, setVisible] = useState<boolean>(false)
    const [current, setCurrent] = useState<Partial<IUserState> | undefined>(undefined)

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
                <AddButton onClick={showAddModal} />
                <UsersTable onShowEditModal={showEditModal} />
            </Card>
            <OpModal visible={visible} current={current} onCancel={() => setVisible(false)} />
        </PageHeaderWrapper>
    )
}

export default ManagementUsers