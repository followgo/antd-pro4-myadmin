import React from 'react'
import classNames from 'classnames'
import { Button, Form } from 'antd'
import { ButtonProps } from 'antd/es/button'

import styles from './index.less'

interface IProps extends ButtonProps {
    className?: string
}

const LoginSubmitButton: React.FC<IProps> = ({ className, ...rest }) => {
    return (
        <Form.Item>
            <Button
                size="large"
                // 由于 react 原生动态添加多个 className 会报错，使用 classNames 可以解决此问题
                className={classNames(styles.submit, className)}
                type="primary"
                htmlType="submit"
                {...rest}
            />
        </Form.Item>
    )
}

export default LoginSubmitButton
