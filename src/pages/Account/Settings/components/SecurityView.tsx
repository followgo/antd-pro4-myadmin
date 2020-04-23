import React, { Component } from 'react';
import { List } from 'antd';
import { ConnectState, IUserModelState } from '@/models/connect';
import { connect, ConnectProps } from 'umi'
import ChangePasswordModal from './Modals/ChnagePasswordModal'
import './SecurityView.less'

type Unpacked<T> = T extends (infer U)[] ? U : T

const passwordStrength = {
  strong: <span className="strong">安全</span>,
  medium: <span className="medium">一般</span>,
  weak: <span className="weak">不安全</span>,
}

interface ISecurityViewProps extends ConnectProps {
  currentUser: IUserModelState
}

class SecurityView extends Component<ISecurityViewProps> {
  state = {
    changePasswordModalVisible: false
  }

  handleToggleChangePasswordModalVisible = (show: boolean) => {
    this.setState({ changePasswordModalVisible: show })
  }

  getData = (pwdStrength: JSX.Element) => [
    {
      title: '账号密码',
      description: (
        <>
          当前密码强度：{pwdStrength}
        </>
      ),
    },
  ]

  handleClick = (keyword: 'change_password') => {
    switch (keyword) {
      case 'change_password':
        this.handleToggleChangePasswordModalVisible(true)
        break
      default:
      // nothing
    }
  }

  render() {
    const { currentUser } = this.props
    let pwdStrength: JSX.Element = passwordStrength.weak
    if (currentUser && currentUser.password) {
      if (currentUser.password.length > 8) {
        pwdStrength = passwordStrength.strong
      } else if (currentUser.password.length >= 6) {
        pwdStrength = passwordStrength.medium
      } else {
        pwdStrength = passwordStrength.weak
      }
    }

    const data = this.getData(pwdStrength)
    return (
      <>
        <List<Unpacked<typeof data>> size="large" itemLayout="horizontal" dataSource={data}
          renderItem={item => (
            <List.Item actions={[<a onClick={e => { e.preventDefault(); this.handleClick('change_password') }}>修改</a>]}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />

        {/* Modals */}
        <ChangePasswordModal userUUID={currentUser.uuid} visible={this.state.changePasswordModalVisible} onDestroy={() => this.handleToggleChangePasswordModalVisible(false)} />
      </>
    )
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user,
}))(SecurityView)