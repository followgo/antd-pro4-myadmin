import React from 'react'
import { Input, Form } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import LoginContext from './LoginContext'
import { IFormItemProps, getFormItemOptions } from './formItem.d'
import styles from './index.less'

const formItemOptions = {
    props: {
        size: 'large',
        id: 'username',
        prefix: <UserOutlined style={{ color: '#1890ff' }} className={styles.prefixIcon} />,
        placeholder: '用户名',
    },
    rules: [
        {
            required: true,
            message: '请输入用户名',
        },
    ],
}

const FormItem: React.FC<IFormItemProps> = (props) => {
    // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules props tabUtil
    const {
        onChange,
        customProps,
        defaultValue,
        rules,
        name,
        getCaptchaButtonText,
        getCaptchaSecondText,
        updateActive,
        type,
        tabUtil,
        ...restProps
    } = props

    // get getFieldDecorator props
    const options = getFormItemOptions(props)
    const otherProps = restProps || {}

    return (
        <Form.Item name={name} {...options}>
            <Input {...customProps} {...otherProps} />
        </Form.Item>
    )
}

const WrapContext: React.FC<IFormItemProps> = (props) => (
    <LoginContext.Consumer>
        {(context) => (
            <FormItem
                customProps={formItemOptions.props}
                rules={formItemOptions.rules}
                {...props}
                {...context}
                updateActive={context.updateActive}
            />
        )}
    </LoginContext.Consumer>
)

export default WrapContext