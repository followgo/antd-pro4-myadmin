import React, { FC, useEffect, useState } from 'react'
import { Modal, Form, Input, Upload, Button, Select, message } from 'antd'
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
        console.log(values)
        onCancel()
        // if (current) {
        //     const patch_fields = ['enabled', 'nickname', 'account_name', 'authority']
        //     if (resetPassword) patch_fields.push('password')
        //     dispatch({
        //         type: 'users/changeUser', payload: { data: { ...values, uuid: current.uuid }, patch_fields }, callback: () => {
        //             onCancel()
        //         }
        //     })
        // } else {
        //     dispatch({
        //         type: 'users/createUser', payload: { ...values, uuid: '' }, callback: () => {
        //             onCancel()
        //         }
        //     })
        // }
    }

    // 上传按钮的参数
    const uploadProps = {
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e7',
        multiple: false,
        accept: '.jpg,.webp',
        beforeUpload(file, fileList) {
            console.log(file, fileList)
        },
        onChange({ file, fileList }) {
            if (file.status === 'done') message.success(`${file.name} 文件上传成功`)
            else if (file.status === 'error') {
                message.error(`${file.name} 文件上传失败`)
                fileList = []
            }
        }
    }

    const normFile = (e: { fileList: any }) => {
        if (Array.isArray(e)) return e
        return e && e.fileList
    }

    const getModalContent = () => {
        return (
            <Form {...formLayout} form={form} onFinish={handleFinish} initialValues={{ purpose: 'index' }}>
                <Form.Item label="图片" name="images" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload {...uploadProps} listType="picture">
                        <Button><UploadOutlined /> Click to upload</Button>
                    </Upload>
                </Form.Item>

                <Form.Item name="target_url" label="链接地址">
                    <Input />
                </Form.Item>
                <Form.Item name="title" label="标题" rules={[
                    { required: true, message: '请输入横幅的标题' },
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item name="intro" label="介绍">
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
    )
}

export default connect(({ loading }: ConnectState) => ({
    submiting: loading.effects['users/createUser'] || loading.effects['users/changeUser']
}))(OpModal)
