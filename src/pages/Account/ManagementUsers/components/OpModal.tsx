import React, { FC, useEffect, useState } from 'react'
import { Modal, Form, Input, Select, Switch, Radio } from 'antd'
import { IUserAccount } from '@/services/user'
import { Dispatch, connect } from 'umi'
import { ConnectState } from '@/models/connect'
import { Store } from 'antd/es/form/interface'

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
        if (form && !visible) form.resetFields()
    }, [visible])

    useEffect(() => {
        if (current) {
            form.setFieldsValue({ ...current, password: '87654321' })
        } else {
            form.setFieldsValue({ enabled: true, password: '12345678' })
        }
    }, [current])

    const handleSubmit = () => {
        if (!form) return
        form.submit()
    }

    const handleFinish = (values: Store) => {
        console.log(values, current)
    };

    const getModalContent = () => {
        return (
            <Form {...formLayout} form={form} onFinish={handleFinish}>
                <Form.Item name="account_name" label="登陆账号"
                    rules={[
                        { required: true, message: '请输入登陆账号' },
                        { type: 'string', min: 4, message: '登陆账号太短了' },
                    ]}>
                    <Input />
                </Form.Item>
                {
                    current &&
                    <Form.Item label="重置密码">
                        <Switch checked={resetPassword} onChange={()=>{setResetPassword(!resetPassword)}} />
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
    submiting: loading.effects['users/create'] || loading.effects['users/update']
}))(OpModal)
