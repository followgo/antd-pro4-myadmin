import React, { useRef, useState, useEffect } from 'react'
import { DownOutlined, PlusOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Col, Dropdown, Input, List, Menu, Modal, Progress, Radio, Row, } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import styles from './style.less'
import UserDefaultAvatar from '@/assets/userDefaultAvatar.png'

const ManagementUsers: React.FC<IUserAccount> = (props) => {
    return (
        <PageHeaderWrapper title={false}>
            <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} onClick={() => ({})}>
                <PlusOutlined /> 添加
            </Button>
        </PageHeaderWrapper>
    )

}
export default ManagementUsers