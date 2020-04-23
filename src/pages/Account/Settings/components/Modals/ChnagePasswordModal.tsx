import React, { useState } from 'react'
import { Modal, Form, Input, message, } from 'antd'
import { Store } from 'antd/es/form/interface'
import { patchUserAccount } from '@/services/user'

interface IFormValues {
    now_password: string
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

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } }

    const handleOk = (values: Store) => {
        const formValues = (values as IFormValues)
        setLoading(true)

        patchUserAccount({ uuid: userUUID, password: formValues.now_password, new_password: formValues.new_password1 }, ['password'])
            .then(res => {
                setLoading(false)

                if (res.status === 201) {
                    message.success('密码已修改，下次登陆请使用新密码')
                    onDestroy()
                } else {
                    message.warning('重置密码失败')
                }
            })
    }

    return (
        <Modal title="重置登陆账号的密码" visible={visible} confirmLoading={loading} onCancel={onDestroy}
            onOk={() => {
                form.validateFields()
                    .then(values => {
                        form.resetFields()
                        handleOk(values)
                    })
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    .catch(err => {
                        // handle err
                    })
            }}
        >
            <Form {...layout} name="basic" form={form}>

                <Form.Item label="当前密码" name="now_password"
                    rules={[
                        { required: true, message: '请输入当前密码' },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item label="新密码" name="new_password"
                    hasFeedback
                    rules={[
                        { required: true, message: '请输入新密码' },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item label="确认新密码" dependencies={['new_password']}
                    hasFeedback
                    rules={[
                        { required: true, message: '请再次输入新密码' },
                        ({ getFieldValue }) => ({
                            async validator(_, value) {
                                if (!value || getFieldValue('new_password1') === value) {
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