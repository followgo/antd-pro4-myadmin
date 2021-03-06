import { LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { Avatar, Menu, Spin } from 'antd'
import { ClickParam } from 'antd/es/menu'
import React from 'react'
import { history, ConnectProps, connect } from 'umi'
import { ConnectState, IUserState } from '@/models/connect'
import UserDefaultAvatar from '@/assets/userDefaultAvatar.png'
import HeaderDropdown from '../HeaderDropdown'
import styles from './index.less'

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  currentUser?: IUserState
  menu?: boolean
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({ type: 'login/logout' })
      }

      return;
    }

    history.push(`/account/${key}`);
  };

  render(): React.ReactNode {
    const { currentUser = { avatar: UserDefaultAvatar, nickname: '', }, menu, } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="my_settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}

        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.nickname ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={UserDefaultAvatar} alt="avatar" />
          <span className={styles.name}>{currentUser.nickname}</span>
        </span>
      </HeaderDropdown>
    ) : (
        <span className={`${styles.action} ${styles.account}`}>
          <Spin
            size="small"
            style={{
              marginLeft: 8,
              marginRight: 8,
            }}
          />
        </span>
      )
  }
}

export default connect(({ current_user }: ConnectState) => ({
  currentUser: current_user,
  menu: true,
}))(AvatarDropdown);
