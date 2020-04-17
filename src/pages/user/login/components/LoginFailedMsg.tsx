import React from 'react'
import { Alert } from 'antd'

// 登陆失败消息条
const LoginFailedMsg: React.FC<{ content: string }> = ({ content }) => (
    <Alert
        style={{ marginBottom: 24 }}
        message={content}
        type="error"
        showIcon
    />
)

export default LoginFailedMsg