import React, { useRef, useState, useEffect } from 'react'
import { DownOutlined, PlusOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Col, Dropdown, Input, List, Menu, Modal, Progress, Radio, Row, } from 'antd'
import { IUserAccount } from '@/services/user'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.less'

const ManagementUsers: React.FC<IUserAccount> = (props) => {
    const extraContent = (
        <div className={styles.extraContent}>
            <Input.Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
        </div>
    )

    return (
        <PageHeaderWrapper title={false}>
            <Card className={styles.listCard} bordered={false} style={{ marginTop: 24 }} bodyStyle={{ padding: '0 32px 40px 32px' }} extra={extraContent}>
                <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} onClick={() => ({})} ref={() => ({})}>
                    <PlusOutlined />添加
                </Button>

                <List size="large" rowKey="id" loading={loading} pagination={paginationProps} dataSource={list}
                    renderItem={(item) => (
                        <List.Item actions={[
                            <a key="edit" onClick={(e) => { e.preventDefault(); showEditModal(item) }}>编辑</a>,
                            <a key="edit" onClick={(e) => { e.preventDefault(); showEditModal(item) }}>删除</a>,
                        ]}>
                            <List.Item.Meta
                                avatar={<Avatar src={item.logo} shape="square" size="large" />}
                                title={<a href={item.href}>{item.title}</a>}
                                description={item.subDescription}
                            />
                            <ListContent data={item} />
                        </List.Item>
                    )}
                />
            </Card>
        </PageHeaderWrapper>
    )

}
export default ManagementUsers