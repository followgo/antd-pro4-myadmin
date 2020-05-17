import React, { useState } from 'react'
import { Card, Menu } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { IUserState } from '@/models/connect'
import AddButton from './components/AddButton'
import BannersTable from './components/BannersTable'
import OpModal from './components/OpModal'

const Banners: React.FC = () => {
    const [visible, setVisible] = useState<boolean>(false)
    const [current, setCurrent] = useState<Partial<IUserState> | undefined>(undefined)

    const showAddModal = () => {
        setCurrent(undefined)
        setVisible(true)
    }

    const showEditModal = (item: IUserState) => {
        setCurrent(item)
        setVisible(true)
    }

    const menuMap = [{ key: 'index', name: '首页横幅' }]
    const [currentMenukey, setcurrentMenukey] = useState<string>('index')
    const renderChildren = () => {
        switch (currentMenukey) {
            case 'index': return <BannersTable onShowEditModal={showEditModal} />
            default: return <BannersTable onShowEditModal={showEditModal} />
        }
    }

    return (
        <PageHeaderWrapper title={false}>
            <Card>
                <AddButton onClick={showAddModal} />
                <OpModal visible={visible} current={current} onCancel={() => setVisible(false)} purposesMap={menuMap} />

                <Menu mode="horizontal" selectedKeys={[currentMenukey]} onClick={({ key }) => setcurrentMenukey(key)}>
                    {menuMap.map(item => <Menu.Item key={item.key}>{item.name}</Menu.Item>)}
                </Menu>

                {renderChildren()}
            </Card>
        </PageHeaderWrapper>
    )
}

export default Banners