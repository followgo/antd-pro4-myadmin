import React, { FC, useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { IUserAccount } from '@/services/user'
import { Dispatch, connect } from 'umi'
import { ConnectState } from '@/models/connect'
import { Store } from 'antd/es/form/interface'
import { UploadFile } from 'antd/lib/upload/interface';
import { uploadBannerFile } from '@/services/upload'
import MyPicUpload from '@/components/MyPicUpload'

interface OperationModalProps {
    dispatch: Dispatch
    visible: boolean
    current: Partial<IUserAccount> | undefined
    purposesMap: Array<{ key: string, name: string }>
    onCancel: () => void
    submiting?: boolean
}

const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } }

const OpModal: FC<OperationModalProps> = ({ visible, current, submiting, purposesMap, onCancel, dispatch }) => {
    const [form] = Form.useForm()

    useEffect(() => {
        if (form && !visible) {
            form.resetFields()
            return
        }

        if (form && visible && current) form.setFieldsValue({ ...current })
        else form.setFieldsValue({ purpose: 'index' })
    }, [current, visible])

    const handleSubmit = () => {
        if (!form) return
        form.submit()
    }

    const handleFinish = (values: Store) => {
        if (current) {
            dispatch({
                type: 'users/changeUser', payload: { data: { ...values, uuid: current.uuid } }, callback: () => {
                    onCancel()
                }
            })
        } else {
            dispatch({
                type: 'users/createUser', payload: { ...values, uuid: '' }, callback: () => {
                    onCancel()
                }
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

                <Form.Item name="target_url" label="链接地址">
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
