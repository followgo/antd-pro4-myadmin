import React, { FC, useEffect } from 'react'
import { Modal, Form, Input, Select, message } from 'antd'
import { Dispatch, connect } from 'umi'
import { ConnectState } from '@/models/connect'
import { Store } from 'antd/es/form/interface'
import { UploadFile } from 'antd/lib/upload/interface';
import { uploadBannerFile } from '@/services/upload'
import MyPicUpload from '@/components/MyPicUpload'
import { IWebsiteBanner } from '@/services/website-banners'

interface OperationModalProps {
    dispatch: Dispatch
    visible: boolean
    current?: Partial<IWebsiteBanner & { uploadFileList?: UploadFile[] }>
    purposesMap: Array<{ key: string, name: string }>
    onCancel: () => void
    submiting?: boolean
}

const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } }

const OpModal: FC<OperationModalProps> = ({ visible, current, submiting, purposesMap, onCancel, dispatch }) => {
    const [form] = Form.useForm()

    // 初始化表单数据
    useEffect(() => {
        if (form && !visible) {
            form.resetFields()
            return
        }

        if (form && visible && current) {
            const { picture_uuid = '', picture_url = '', ...restCurrent } = current
            form.setFieldsValue({
                ...restCurrent, uploadFileList: [
                    { uid: picture_uuid, status: 'done', url: picture_url, response: { data: { uuid: picture_uuid } } }
                ]
            })
        } else {
            form.setFieldsValue({ purpose: 'index' })
        }
    }, [current, visible])

    // 点击 OK 按钮
    const handleSubmit = () => {
        if (!form) return
        form.submit()
    }

    // 提交表单
    const handleFinish = (values: Store) => {
        const { uploadFileList, ...restValues } = (values as IWebsiteBanner & { uploadFileList: UploadFile[] })

        // 获取图片uuid
        let picture_uuid = ''
        if (uploadFileList && uploadFileList.length > 0) {
            if (uploadFileList[0] && uploadFileList[0].response && uploadFileList[0].response.data) {
                picture_uuid = uploadFileList[0].response.data.uuid
            }
        }
        if (!picture_uuid) {
            message.error('请选择一张图片')
            return
        }

        if (current) {
            const { enabled, sort_number, uuid } = current
            dispatch({
                type: 'website_banners/updateItem',
                payload: { ...restValues, picture_uuid, uuid, enabled, sort_number },
                callback: () => { onCancel() }
            })
        } else {
            dispatch({
                type: 'website_banners/createItem',
                payload: { ...restValues, picture_uuid, uuid: '', enabled: false, sort_number: 100 },
                callback: () => { onCancel() }
            })
        }
    }

    const getValueFromUploadEvent = (e: { fileList: Array<UploadFile> }) => {
        if (Array.isArray(e)) return e
        return e && e.fileList.filter(f => f.status === 'done' || f.status === 'uploading')
    }

    const getModalContent = () => {
        return (
            <Form {...formLayout} form={form} onFinish={handleFinish}>

                <Form.Item label="图片" name="uploadFileList" valuePropName="fileList" getValueFromEvent={getValueFromUploadEvent} rules={[
                    { required: true, message: '请上传横幅图片' },
                ]} style={{ marginBottom: 24 - 8 }}>
                    <MyPicUpload uploadApi={uploadBannerFile} maximum={1} />
                </Form.Item>

                <Form.Item name="target_url" label="链接地址" rules={[
                    { type: 'url', message: '请输入有效的链接地址' },
                ]}>
                    <Input />
                </Form.Item>

                <Form.Item name="title" label="标题" rules={[
                    { required: true, message: '请输入横幅的标题' },
                ]}>
                    <Input />
                </Form.Item>

                <Form.Item name="description" label="描述">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item name="purpose" label="用途">
                    <Select allowClear={false}>
                        {purposesMap.map(item => <Select.Option value={item.key} key={`K2Ou_${item.key}`}>{item.name}</Select.Option>)}
                    </Select>
                </Form.Item>
            </Form>
        )
    }

    return (
        <>
            <Modal
                getContainer={false}
                title={`${current ? '编辑' : '添加'}横幅`}
                visible={visible}
                confirmLoading={submiting}
                onCancel={onCancel}
                onOk={handleSubmit}
            >
                {getModalContent()}
            </Modal>
        </>
    )
}

export default connect(({ loading }: ConnectState) => ({
    submiting: loading.effects['users/createUser'] || loading.effects['users/changeUser']
}))(OpModal)
