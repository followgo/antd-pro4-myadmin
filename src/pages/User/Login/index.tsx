import { Checkbox } from 'antd'
import React, { useState } from 'react'
import { connect, Dispatch } from 'umi'
import { ILoginByAccountParamsType } from '@/services/user'
import { ConnectState } from '@/models/connect'
import tokenStorage from '@/utils/tokenStorage'
import LoginForm from './components/LoginForm'
import LoginFailedMsg from './components/LoginFailedMsg'

import styles from './style.less'

const { Tab, NameOrEmail, Password, Submit } = LoginForm

interface LoginProps {
    dispatch: Dispatch
    login_type: string
    submitting?: boolean
}

const Login: React.FC<LoginProps> = (props) => {
    const { login_type, submitting } = props
    const { login_status } = tokenStorage.get()

    const [autoLogin, setAutoLogin] = useState(false)
    const [type, setType] = useState<string>('account')

    const handleSubmit = (values: ILoginByAccountParamsType) => {
        const { dispatch } = props
        dispatch({ type: 'login/loginByAccount', payload: { ...values } })
    }

    return (
        <div className={styles.main}>
            <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
                <Tab key="account" tab="本地账号登录">
                    {login_status === 'aborted' && login_type === 'account' && !submitting && (<LoginFailedMsg content="账号或密码错误" />)}
                    <NameOrEmail name="name_or_email" />
                    <Password name="password" />
                </Tab>
                <Tab key="ldap" tab="LDAP 认证登陆" disabled />
                <div>
                    <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)} disabled>
                        自动登录
                    </Checkbox>
                    {/* <a type="link" style={{ float: 'right' }}>
                        忘记密码
                    </a> */}
                </div>
                <Submit loading={submitting}>登录</Submit>
            </LoginForm>
        </div>
    )
}

export default connect(({ login, loading }: ConnectState) => ({
    login_type: login.login_type,
    submitting: loading.effects['login/loginByAccount'],
}))(Login)
