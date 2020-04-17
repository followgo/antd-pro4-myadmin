import React, { useEffect } from 'react'
import { TabPaneProps } from 'antd/es/tabs'
import { Tabs } from 'antd'
import { makeIncrIdGenerator } from '@/utils/other'
import LoginContext, { ILoginContextProps } from './LoginContext'

// Tab id 生成器
const generateTabId = makeIncrIdGenerator('login-tab-')

interface LoginTabProps extends TabPaneProps {
  tabUtil: ILoginContextProps['tabUtil']
  active?: boolean
}

// 登陆表单 Tab
const LoginTab: React.FC<LoginTabProps> = (props) => {
  useEffect(() => {
    if (props.tabUtil) {
      props.tabUtil.addTab(generateTabId())
    }
  }, [])

  return (
    <Tabs.TabPane {...props}>
      {props.active && props.children}
    </Tabs.TabPane>
  )
}

const WrapContext: React.FC<TabPaneProps> & { typeName: string } = (props) => (
  <LoginContext.Consumer>
    {
      (value) => <LoginTab tabUtil={value.tabUtil} {...props} />
    }
  </LoginContext.Consumer>
)

// 标志位 用来判断是不是自定义组件
WrapContext.typeName = 'LoginTab'
export default WrapContext
