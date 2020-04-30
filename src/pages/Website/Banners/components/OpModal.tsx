import React, { FC, useEffect, useState } from 'react'
import { Modal, Form, Input, Upload, Button, Select } from 'antd'
import { IUserAccount } from '@/services/user'
import { Dispatch, connect } from 'umi'
import { ConnectState } from '@/models/connect'
import { Store } from 'antd/es/form/interface'
import { randAlphaNum } from '@/utils/other'
import { UploadOutlined } from '@ant-design/icons'

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
    const [resetPassword, setResetPassword] = useState(false)
    const [form] = Form.useForm()

    useEffect(() => {
        if (form && !visible) {
            form.resetFields()
            setResetPassword(false)
            return
        }

        if (form && visible && current) {
            form.setFieldsValue({ ...current, password: randAlphaNum(8) })
        } else {
            form.setFieldsValue({ enabled: true, password: randAlphaNum(8) })
        }
    }, [current, visible])

    const handleSubmit = () => {
        if (!form) return
        form.submit()
    }

    const handleFinish = (values: Store) => {
        if (current) {
            const patch_fields = ['enabled', 'nickname', 'account_name', 'authority']
            if (resetPassword) patch_fields.push('password')
            dispatch({
                type: 'users/changeUser', payload: { data: { ...values, uuid: current.uuid }, patch_fields }, callback: () => {
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

    const getModalContent = () => {
        return (
            <Form {...formLayout} form={form} onFinish={handleFinish}>
                <Form.Item label="Dragger">
                    <Form.Item name="dragger" valuePropName="fileList" noStyle>
                        <Upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" accept=".jpg,.webp" listType="picture">
                            <Button><UploadOutlined /> Upload</Button>
                        </Upload>
                    </Form.Item>
                </Form.Item>
                <Form.Item name="target_url" label="链接地址">
                    <Input />
                </Form.Item>
                <Form.Item name="title" label="标题">
                    <Input />
                </Form.Item>
                <Form.Item name="intro" label="介绍">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="purpose" label="用途" rules={[
                    { required: true, message: '请选择权限' },
                ]}>
                    <Select defaultValue={purposesMap[0].key}>
                        {purposesMap.map(item => <Select.Option value={item.key}>{item.name}</Select.Option>)}
                    </Select>
                </Form.Item>
            </Form>
        )
    }

    return (
        <Modal
            getContainer={false}
            title={`${current ? '编辑' : '添加'}用户`}
            visible={visible}
            confirmLoading={submiting}
            onCancel={onCancel}
            onOk={handleSubmit}
        >
            {getModalContent()}
        </Modal>
    )
}

export default connect(({ loading }: ConnectState) => ({
    submiting: loading.effects['users/createUser'] || loading.effects['users/changeUser']
}))(OpModal)
