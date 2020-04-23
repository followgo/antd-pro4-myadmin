import React, { Component } from 'react';
import { Dispatch, connect } from 'umi';
import { PageHeaderWrapper, GridContent } from '@ant-design/pro-layout'
import { Menu } from 'antd';
import { ConnectState, IUserModelState } from '@/models/connect'
import BaseView from './components/BaseView';
import SecurityView from './components/SecurityView';
import styles from './style.less';

const { Item } = Menu

interface SettingsProps {
  dispatch: Dispatch;
  currentUser: IUserModelState
}

type SettingsStateKeys = 'base' | 'security'

interface SettingsState {
  mode: 'inline' | 'horizontal';
  menuMap: {
    [key: string]: React.ReactNode;
  };
  selectKey: SettingsStateKeys;
}

class Settings extends Component<SettingsProps, SettingsState> {
  main: HTMLDivElement | undefined = undefined;

  constructor(props: SettingsProps) {
    super(props);
    const menuMap = {
      base: '基本设置',
      security: '安全设置'
    };
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: 'base',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'user/mysettings' });
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = (key: SettingsStateKeys) => {
    this.setState({
      selectKey: key,
    });
  };

  resize = () => {
    if (!this.main) {
      return;
    }

    requestAnimationFrame(() => {
      if (!this.main) {
        return;
      }

      let mode: 'inline' | 'horizontal' = 'inline';
      const { offsetWidth } = this.main;

      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      this.setState({
        mode,
      });
    });
  };

  renderChildren = () => {
    const { selectKey } = this.state;

    switch (selectKey) {
      case 'base':
        return <BaseView />

      case 'security':
        return <SecurityView />

      default:
        break;
    }

    return null;
  };

  render() {
    const { currentUser } = this.props;

    if (!currentUser.uuid) {
      return '';
    }

    const { mode, selectKey } = this.state;
    return (
      <PageHeaderWrapper title={false}>
        <GridContent>
          <div
            className={styles.main}
            ref={ref => {
              if (ref) {
                this.main = ref;
              }
            }}
          >
            <div className={styles.leftMenu}>
              <Menu
                mode={mode}
                selectedKeys={[selectKey]}
                onClick={({ key }) => this.selectKey(key as SettingsStateKeys)}
              >
                {this.getMenu()}
              </Menu>
            </div>
            <div className={styles.right}>
              <div className={styles.title}>{this.getRightTitle()}</div>
              {this.renderChildren()}
            </div>
          </div>
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user,
}))(Settings)
