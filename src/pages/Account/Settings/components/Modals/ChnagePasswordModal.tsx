import React, { useState } from 'react'
import { Modal, Form, Input, message, } from 'antd'
import { Store } from 'antd/es/form/interface'
import { patchUserAccount } from '@/services/user'
import { history } from 'umi'

interface IFormValues {
    password: string
    new_password: string
}

interface IChangePasswordModalProps {
    userUUID: string
    visible: boolean
    onDestroy: () => void
}

const ChangePasswordModal: React.FC<IChangePasswordModalProps> = ({ userUUID, visible, onDestroy }) => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()

    const handleDestroy = () => {
        onDestroy()
        form.resetFields()
    }

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } }

    const handleOk = (values: Store) => {
        const formValues = (values as IFormValues)
        setLoading(true)

        patchUserAccount({ uuid: userUUID, password: formValues.password, new_password: formValues.new_password }, ['password'])
            .then(res => {
                setLoading(false)

                if (res.status === 201) {
                    message.success('密码已修改，请使用新密码登陆')
                    handleDestroy()
                    setTimeout(() => history.push('/user/login'), 2000)
                } else {
                    message.warning('重置密码失败')
                }
            })
    }

    return (
        <Modal title="重置登陆账号的密码" visible={visible} confirmLoading={loading} onCancel={handleDestroy}
            onOk={() => {
                form.validateFields()
                    .then(values => {
                        form.resetFields()
                        handleOk(values)
                    })
            }}
        >
            <Form {...layout} name="basic" form={form}>

                <Form.Item label="当前密码" name="password"
                    rules={[
                        { required: true, message: '请输入当前密码' },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item label="新密码" name="new_password" hasFeedback
                    rules={[
                        { required: true, message: '请输入新密码' },
                        { type: 'string', min: 6, message: '密码太短了' },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item label="确认新密码" name="confirm_new_password" dependencies={['new_password']} hasFeedback
                    rules={[
                        { required: true, message: '请再次输入新密码' },
                        ({ getFieldValue }) => ({
                            async validator(_, value) {
                                if (!value || getFieldValue('new_password') === value) {
                                    return Promise.resolve()
                                }
                                // eslint-disable-next-line prefer-promise-reject-errors
                                return Promise.reject('2次输入的新密码不一样')
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

            </Form>
        </Modal>
    )
}

export default ChangePasswordModal