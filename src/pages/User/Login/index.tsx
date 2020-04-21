import { Checkbox } from 'antd'
import React, { useState } from 'react'
import { connect, Dispatch } from 'umi'
import { ILoginByAccountParamsType } from '@/services/user'
import { ConnectState, ILoginState } from '@/models/connect'
import LoginForm from './components/LoginForm'
import LoginFailedMsg from './components/LoginFailedMsg'

import styles from './style.less'

const { Tab, Username, Password, Submit } = LoginForm

interface LoginProps {
    dispatch: Dispatch
    loginState: ILoginState
    submitting?: boolean
}

const Login: React.FC<LoginProps> = (props) => {
    const { loginState, submitting } = props
    const { login_status, login_type } = loginState

    const [autoLogin, setAutoLogin] = useState(true)
    const [type, setType] = useState<string>('account')

    const handleSubmit = (values: ILoginByAccountParamsType) => {
        const { dispatch } = props
        dispatch({ type: 'login/loginByAccount', payload: { ...values } })
    }

    return (
        <div className={styles.main}>
            <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
                <Tab key="account" tab="账户密码登录">
                    {login_status === 'aborted' && login_type === 'account' && !submitting && (<LoginFailedMsg content="账户或密码错误" />)}
                    <Username name="username" />
                    <Password name="password" />
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
    loginState: login,
    submitting: loading.effects['login/loginByAccount'],
}))(Login)
