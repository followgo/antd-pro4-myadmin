import React, { useState, useEffect } from 'react'
import { Modal, Upload, message } from 'antd'
import { UploadProps, UploadChangeParam } from "antd/lib/upload/interface"
import { PlusOutlined } from '@ant-design/icons'
import { convFileToBase64 } from '@/utils/other'
import BMF from 'browser-md5-file'

interface MyAntdUploadProps extends UploadProps {
    maximum: number
    uploadApi: (file: File, md5?: string) => Promise<any>
}

const MyPicUpload: React.FC<MyAntdUploadProps> = ({ fileList = [], ...restProps }) => {
    const [fileNumber, setFileNumber] = useState(0)
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('')

    useEffect(() => { setFileNumber(fileList.length) }, [fileList])

    // 设置默认值
    const {
        listType = 'picture-card',
        accept = '.jpg,.webp,.png',
        children = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">Upload</div>
            </div>
        ),
        beforeUpload = (file) => {
            const allowFileTypes = file.type === 'image/webp' || file.type === 'image/jpeg' || file.type === 'image/png'
            if (!allowFileTypes) message.error('只能上传 webp/jpg/png 类型的文件')

            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isLt2M) message.error('文件大小必须小于 2MB!')

            return allowFileTypes && isLt2M
        },
        onPreview = async (file) => {
            let { preview = '' } = file
            if (!preview) {
                if (file.originFileObj) {
                    await convFileToBase64(file.originFileObj).then(b64 => {
                        preview = b64
                    })
                } else if (file.url) {
                    preview = file.url
                }
            }

            if (preview) {
                setPreviewImage(preview)
                setPreviewVisible(true)
            } else {
                message.error('文件错误')
            }
        },
        customRequest = (options) => {
            new BMF().md5(options.file, (_err: any, md5: string) => {
                restProps.uploadApi(options.file, md5)
                    .then(res => options.onSuccess(res, options.file))
                    .catch(err => options.onError(err))
            })
        }
    } = restProps

    const myProps = {
        fileList,
        listType,
        accept,
        beforeUpload,
        onPreview,
        customRequest,
        onChange: (info: UploadChangeParam) => {
            if (restProps.onChange) restProps.onChange(info)

            switch (info.file.status) {
                case 'done':
                    message.success(`${info.file.name} 文件上传成功`)
                    break
                case 'error':
                    message.error(`${info.file.name} 文件上传失败`)
                    break
                default:
                // ...
            }
        }
    }

    return (
        <>
            <Upload {...restProps} {...myProps}>
                {fileNumber >= restProps.maximum ? null : children}
            </Upload>

            <Modal width={600} centered visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                <img alt="preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    )
}

export default MyPicUpload