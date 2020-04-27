import React, { Component } from 'react';
import { Dispatch } from 'umi';
import { PageHeaderWrapper, GridContent } from '@ant-design/pro-layout'
import { Menu } from 'antd'
import BaseView from './components/BaseView'
import styles from './style.less'

interface IMySettingsState {
  mode: 'inline' | 'horizontal'
  menuMap: { [key: string]: React.ReactNode }
  selectKey: string
}

class WebsiteSettings extends Component<{ dispatch: Dispatch }, IMySettingsState> {
  main: HTMLDivElement | undefined = undefined;

  constructor(props: { dispatch: Dispatch }) {
    super(props)
    this.state = {
      mode: 'inline',
      menuMap: { main: '主要信息', seo: 'SEO相关', script: '页面脚本' },
      selectKey: 'main',
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize)
    this.resize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map(item => <Menu.Item key={item}>{menuMap[item]}</Menu.Item>)
  }

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state
    return menuMap[selectKey]
  }

  selectKey = (key: string) => { this.setState({ selectKey: key }) }

  resize = () => {
    if (!this.main) return

    requestAnimationFrame(() => {
      if (!this.main) return

      let mode: 'inline' | 'horizontal' = 'inline'
      const { offsetWidth } = this.main
      if (offsetWidth < 641 && offsetWidth > 400) { mode = 'horizontal' }
      if (window.innerWidth < 768 && offsetWidth > 400) { mode = 'horizontal' }

      this.setState({ mode })
    })
  }

  renderChildren = () => {
    switch (this.state.selectKey) {
      case 'main':
        return <BaseView />

      case 'seo':
        return <h1>Base Page2</h1>

      case 'script':
        return <h1>Base Page3</h1>

      default:
        return <h1>No content</h1>
    }
  }

  render() {
    const { mode, selectKey } = this.state
    return (
      <PageHeaderWrapper title={false}>
        <GridContent>
          <div
            className={styles.main}
            ref={ref => { if (ref) { this.main = ref } }}
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
    )
  }
}

export default WebsiteSettings