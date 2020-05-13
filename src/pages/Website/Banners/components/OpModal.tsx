import React, { FC, useEffect, useState } from 'react'
import { Modal, Form, Input, Upload, Select, message } from 'antd'
import { IUserAccount } from '@/services/user'
import { Dispatch, connect } from 'umi'
import { ConnectState } from '@/models/connect'
import { Store } from 'antd/es/form/interface'
import { UploadOutlined } from '@ant-design/icons'
import { RcFile, UploadChangeParam, UploadFile, RcCustomRequestOptions } from 'antd/lib/upload/interface';
import BMF from 'browser-md5-file'
import { uploadBannerFile } from '@/services/upload'
import { convFileToBase64 } from '../../../../utils/other';

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
    const [fileCounter, setFileCounter] = useState(0)
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('')

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

    // 上传按钮的参数
    const uploadProps = {
        multiple: false,
        accept: '.jpg,.webp,.png',
        beforeUpload(file: RcFile) {
            const allowFileTypes = file.type === 'image/webp' || file.type === 'image/jpeg' || file.type === 'image/png'
            if (!allowFileTypes) message.error('只能上传 webp/jpg/png 类型的文件')

            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isLt2M) message.error('文件大小必须小于 2MB!')

            return allowFileTypes && isLt2M
        },
        onChange(info: UploadChangeParam<UploadFile<any>>) {
            switch (info.file.status) {
                case 'done':
                    setFileCounter(fileCounter + 1)
                    message.success(`${info.file.name} 文件上传成功`)
                    break
                case 'error':
                    message.error(`${info.file.name} 文件上传失败`)
                    break
                case 'removed':
                    setFileCounter(fileCounter - 1)
                    break
                default:
                // ...
            }
        },
        // 自定义上传
        customRequest(reqOpt: RcCustomRequestOptions) {
            new BMF().md5(reqOpt.file, (_err: any, md5: string) => {
                uploadBannerFile(reqOpt.file, md5)
                    .then(res => reqOpt.onSuccess(res, reqOpt.file))
                    .catch(err => reqOpt.onError(err))
            })
        },
        async onPreview(file: UploadFile<any>) {
            let { preview = '' } = file
            if (!preview) {
                if (file.originFileObj) {
                    await convFileToBase64(file.originFileObj).then(b64 => {
                        preview = b64
                    })
                } else if (file.url) {
                    preview = file.url
                } else {
                    message.error('错误的文件')
                }
            }

            setPreviewImage(preview)
            setPreviewVisible(true)
        }
    }

    const getValueFromUploadEvent = (e: { fileList: Array<UploadFile<any>> }) => {
        if (Array.isArray(e)) return e
        return e && e.fileList.filter(f => f.status === 'done' || f.status === 'uploading')
    }

    const getModalContent = () => {
        return (
            <Form {...formLayout} form={form} onFinish={handleFinish}>
                <Form.Item label="图片" name="uploadFileList" valuePropName="fileList" getValueFromEvent={getValueFromUploadEvent} rules={[
                    { required: true, message: '请上传横幅图片' },
                ]}>
                    <Upload {...uploadProps} listType="picture-card">
                        {fileCounter >= 1 ? null : <UploadOutlined />}
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

            <Modal width={600} centered visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                <img alt="preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    )
}

export default connect(({ loading }: ConnectState) => ({
    submiting: loading.effects['users/createUser'] || loading.effects['users/changeUser']
}))(OpModal)
