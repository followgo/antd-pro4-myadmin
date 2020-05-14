import React, { useEffect } from 'react'
import { Modal, Form, Input, notification, } from 'antd'
import { Store } from 'antd/es/form/interface'
import { history, connect, Dispatch } from 'umi'
import { ConnectState } from '@/models/connect'

interface IFormValues {
    uuid: string
    password: string
    new_password: string
}

interface IChangePasswordModalProps {
    dispatch: Dispatch
    userUUID: string
    visible: boolean
    submitting?: boolean
    onCancel: () => void
}

const ChangePasswordModal: React.FC<IChangePasswordModalProps> = ({ dispatch, submitting, userUUID, visible, onCancel }) => {
    const [form] = Form.useForm()
    useEffect(() => {
        if (form && !visible) form.resetFields()
    }, [visible])

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 12 } }

    const handleOk = (values: Store) => {
        const formValues = (values as IFormValues)
        formValues.uuid = userUUID

        dispatch({
            type: 'current_user/changePassword', payload: formValues, callback: () => {
                notification.warning({ description: '请使用新密码登陆', message: '密码已修改' })
                onCancel()
                setTimeout(() => history.push('/user/login'), 2000)
            }
        })
    }

    return (
        <Modal getContainer={false} title="重置登陆账号的密码" visible={visible} confirmLoading={submitting} onCancel={onCancel}
            onOk={() => {
                form.validateFields().then(values => handleOk(values))
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

                <Form.Item label="新密码" name="new_password"
                    rules={[
                        { required: true, message: '请输入新密码' },
                        { type: 'string', min: 6, message: '密码太短了' },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item label="确认新密码" name="confirm_new_password" dependencies={['new_password']}
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


export default connect(({ loading }: ConnectState) => ({
    submitting: loading.effects['current_user/changePassword'],
}))(ChangePasswordModal)