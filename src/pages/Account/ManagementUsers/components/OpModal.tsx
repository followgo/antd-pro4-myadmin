import React, { FC, useEffect, useState } from 'react'
import { Modal, Form, Input, Switch, Radio } from 'antd'
import { IUserAccount } from '@/services/user'
import { Dispatch, connect } from 'umi'
import { ConnectState } from '@/models/connect'
import { Store } from 'antd/es/form/interface'
import { randAlphaNum } from '@/utils/other'

interface OperationModalProps {
    dispatch: Dispatch
    visible: boolean
    current: Partial<IUserAccount> | undefined
    onCancel: () => void
    submiting?: boolean
}

const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 12 } }

const OpModal: FC<OperationModalProps> = ({ visible, current, submiting, onCancel, dispatch }) => {
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
                type: 'users/patchItem', payload: { data: { ...values, uuid: current.uuid }, patch_fields }, callback: () => {
                    onCancel()
                }
            })
        } else {
            dispatch({
                type: 'users/createItem', payload: { ...values, uuid: '' }, callback: () => {
                    onCancel()
                }
            })
        }
    }

    const getModalContent = () => {
        return (
            <Form {...formLayout} form={form} onFinish={handleFinish}>
                <Form.Item name="account_name" label="登陆账号"
                    rules={[
                        { required: true, message: '请输入登陆账号' },
                        { type: 'string', min: 4, message: '登陆账号太短了' },
                        { pattern: /^[A-Za-z]/, message: '必须以英文字母开头' },
                        { pattern: /^[A-Za-z0-9_]*$/g, message: '只能包含英文字母、数字和下划线' },
                    ]}>
                    <Input />
                </Form.Item>
                {
                    current &&
                    <Form.Item label="重置密码">
                        <Switch checked={resetPassword} onChange={() => { setResetPassword(!resetPassword) }} />
                    </Form.Item>
                }
                {
                    (!current || resetPassword) &&
                    <Form.Item name="password" label="随机密码(只读)">
                        <Input readOnly />
                    </Form.Item>
                }
                <Form.Item name="authority" label="权限"
                    rules={[
                        { required: true, message: '请选择权限' },
                    ]}
                >
                    <Radio.Group >
                        <Radio.Button value="guest">GUEST</Radio.Button>
                        <Radio.Button value="user">USER</Radio.Button>
                        <Radio.Button value="admin">ADMIN</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="enabled" label="使能" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item name="nickname" label="绰号">
                    <Input />
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
    submiting: loading.effects['users/createItem'] || loading.effects['users/patchItem']
}))(OpModal)
