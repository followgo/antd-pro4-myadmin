import { Checkbox } from 'antd'
import React, { useState } from 'react'
import { connect, Dispatch } from 'umi'
import { StateType } from '@/models/login'
import { LoginParamsType } from '@/services/login'
import { ConnectState } from '@/models/connect'
import LoginForm from './components/LoginForm'
import LoginFailedMsg from './components/LoginFailedMsg'

import styles from './style.less'

const { Tab, Username, Password, Submit } = LoginForm

interface LoginProps {
    dispatch: Dispatch
    userLogin: StateType
    submitting?: boolean
}

const Login: React.FC<LoginProps> = (props) => {
    const { userLogin = {}, submitting } = props
    const { status, type: loginType } = userLogin
    const [autoLogin, setAutoLogin] = useState(true)
    const [type, setType] = useState<string>('account')

    const handleSubmit = (values: LoginParamsType) => {
        const { dispatch } = props
        dispatch({
            type: 'login/login',
            payload: { ...values, type },
        })
    }

    return (
        <div className={styles.main}>
            <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
                <Tab key="account" tab="账户密码登录">
                    {status === 'error' && loginType === 'account' && !submitting && (
                        <LoginFailedMsg content="账户或密码错误" />
                    )}

                    <Username />
                    <Password />
                </Tab>
                <Tab key="ldap" tab="LDAP 认证登陆" disabled />
                <div>
                    <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
                        自动登录
                    </Checkbox>
                    <a style={{ float: 'right' }} >忘记密码</a>
                </div>
                <Submit loading={submitting}>登录</Submit>
            </LoginForm>
        </div>
    )
}

export default connect(({ login, loading }: ConnectState) => ({
    userLogin: login,
    submitting: loading.effects['login/login'],
}))(Login)
