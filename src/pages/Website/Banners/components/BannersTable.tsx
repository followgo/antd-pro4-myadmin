import React, { useEffect, useState } from 'react'
import { CloseOutlined, CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Table, Popconfirm, Button, Modal, InputNumber } from 'antd'
import { connect, Dispatch } from 'umi'
import { ConnectState, IWebsiteBannerState } from '@/models/connect'
import { IWebsiteBanner } from '@/services/website-banners'

interface IManagementUsersProps {
    dispatch: Dispatch
    banners: IWebsiteBanner[]
    onShowEditModal: (data: IWebsiteBanner) => void
    loading: boolean
    changing: boolean
    deleting: boolean
}

const BannersTable: React.FC<IManagementUsersProps> = ({ dispatch, banners, onShowEditModal, loading = false, changing = false, deleting = false }) => {
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [countdownTimer, setCountdownTimer] = useState<Map<string, number>>(new Map())

    useEffect(() => {
        dispatch({ type: 'website_banners/query' })
    }, [])

    const showPreviewImage = (imgUrl?: string) => {
        if (imgUrl) {
            setPreviewImage(imgUrl)
            setPreviewVisible(true)
        }
    }

    const handleToggleEnable = (item: IWebsiteBanner) => {
        dispatch({ type: 'website_banners/patchItem', payload: { data: { ...item, enabled: !item.enabled }, patch_fields: ['enabled'] } })
    }

    const handleSort = (item: IWebsiteBanner, sort_number: number) => {
        // 改变本地数据
        dispatch({ type: 'website_banners/changeItem', payload: { ...item, sort_number } })

        // 改变服务器的数据
        const timer_key = `${item.uuid}_sort`
        if (countdownTimer.has(timer_key)) {
            window.clearTimeout(countdownTimer.get(timer_key))
        }
        countdownTimer.set(timer_key, window.setTimeout(() => {
            dispatch({ type: 'website_banners/patchItem', payload: { data: { ...item, sort_number }, patch_fields: ['sort_number'] } })
            countdownTimer.delete(timer_key)
            setCountdownTimer(countdownTimer)
        }, 1500))

        setCountdownTimer(countdownTimer)
    }
    const handleDelete = (item: IWebsiteBanner) => {
        dispatch({ type: 'website_banners/deleteItem', payload: { uuid: item.uuid } })
    }

    const columns = [
        {
            title: '图片', key: 'picture_uuid', render: (_text: string, record: IWebsiteBannerState) => {
                return (
                    <a onClick={() => showPreviewImage(record.picture_url)}>
                        <img alt="" src={record.picture_url} style={{ maxHeight: 120, maxWidth: 300 }} />
                    </a>
                )
            }
        },
        { title: '链接地址', dataIndex: 'target_url', key: 'target_url' },
        { title: '标题', dataIndex: 'title', key: 'title' },
        { title: '描述', dataIndex: 'description', key: 'description' },
        {
            title: '排序编号', key: 'sort_number', width: 100,
            sorter: (a: IWebsiteBanner, b: IWebsiteBanner) => a.sort_number - b.sort_number, defaultSortOrder: 'ascend',
            render: (_text: string, record: IWebsiteBanner) => {
                return (
                    <InputNumber disabled={changing} min={1} max={200} step={1} value={record.sort_number} onChange={value => handleSort(record, value || 0)} />
                )
            }
        },
        {
            title: '使能', key: 'enabled', render: (_text: string, record: IWebsiteBanner) => {
                return (
                    <Popconfirm onConfirm={() => handleToggleEnable(record)} title={record.enabled ? '去使能此横幅？' : '使能此横幅？'}>
                        <Button loading={changing} type='link' danger={!record.enabled} icon={record.enabled ? <CheckOutlined /> : <CloseOutlined />} />
                    </Popconfirm>
                )
            }
        },
        {
            title: '行动', key: 'action', width: 110, render: (_text: string, record: IWebsiteBanner) => {
                return (
                    <>
                        <Button onClick={() => onShowEditModal(record)} size="small" icon={<EditOutlined />} style={{ marginRight: 10 }} />
                        <Popconfirm onConfirm={() => handleDelete(record)} title='删除此横幅？'>
                            <Button loading={deleting} size="small" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </>
                )
            }
        }
    ]

    return (
        <>
            <Table pagination={false} loading={loading} columns={columns} dataSource={banners} rowKey={record => record.uuid} />

            <Modal width={650} centered visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                <img alt="preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    )
}

export default connect(({ website_banners, loading }: ConnectState) => ({
    banners: website_banners,
    loading: loading.effects['website_banners/query'] || false,
    changing: loading.effects['website_banners/updateItem'] || loading.effects['website_banners/patchItem'] || false,
    deleting: loading.effects['website_banners/deleteItem'] || false,
}))(BannersTable)
