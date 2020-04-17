import { Tabs, Form } from 'antd'
import React, { useState } from 'react'
import useMergeValue from 'use-merge-value'
import classNames from 'classnames'
import { FormInstance } from 'antd/es/form'
import { LoginParamsType } from '@/services/login'

import LoginContext from './LoginContext'
import LoginTab from './LoginTab'
import LoginSubmitButton from './LoginSubmitButton'
import { IFormItemProps } from './formItem.d'
import FormItemUsername from './FormItemUsername'
import FormItemPassword from './FormItemPassword'
import styles from './index.less'

export interface ILoginProps {
    activeKey?: string
    onTabChange?: (key: string) => void
    style?: React.CSSProperties
    onSubmit?: (values: LoginParamsType) => void
    className?: string
    from?: FormInstance
    children: React.ReactElement<typeof LoginTab>[]
}

interface ILoginType extends React.FC<ILoginProps> {
    Tab: typeof LoginTab
    Submit: typeof LoginSubmitButton
    Username: React.FunctionComponent<IFormItemProps>
    Password: React.FunctionComponent<IFormItemProps>
}

const Login: ILoginType = (props) => {
    const [tabs, setTabs] = useState<string[]>([])
    const [active, setActive] = useState({})
    const [type, setType] = useMergeValue('', {
        value: props.activeKey,
        onChange: props.onTabChange,
    })
    const TabChildren: React.ReactComponentElement<typeof LoginTab>[] = []
    const otherChildren: React.ReactElement<unknown>[] = []
    React.Children.forEach(
        props.children,
        (child: React.ReactComponentElement<typeof LoginTab> | React.ReactElement<unknown>) => {
            if (!child) {
                return
            }
            if ((child.type as { typeName: string }).typeName === 'LoginTab') {
                TabChildren.push(child as React.ReactComponentElement<typeof LoginTab>)
            } else {
                otherChildren.push(child)
            }
        },
    )

    return (
        <LoginContext.Provider
            value={{
                tabUtil: {
                    addTab: (id) => {
                        setTabs([...tabs, id])
                    },
                    removeTab: (id) => {
                        setTabs(tabs.filter((currentId) => currentId !== id))
                    },
                },
                updateActive: (activeItem) => {
                    if (!active) return
                    if (active[type]) {
                        active[type].push(activeItem)
                    } else {
                        active[type] = [activeItem]
                    }
                    setActive(active)
                },
            }}
        >
            <div className={classNames(props.className, styles.login)}>
                <Form
                    form={props.from}
                    onFinish={(values) => {
                        if (props.onSubmit) {
                            props.onSubmit(values as LoginParamsType)
                        }
                    }}
                >
                    {tabs.length ?
                        (
                            <React.Fragment>
                                <Tabs
                                    animated={false}
                                    className={styles.tabs}
                                    activeKey={type}
                                    onChange={(activeKey) => {
                                        setType(activeKey);
                                    }}
                                >
                                    {TabChildren}
                                </Tabs>
                                {otherChildren}
                            </React.Fragment>
                        ) : (
                            props.children
                        )
                    }
                </Form>
            </div>
        </LoginContext.Provider>
    );
};

Login.Tab = LoginTab
Login.Submit = LoginSubmitButton
Login.Username = FormItemUsername
Login.Password = FormItemPassword

export default Login
