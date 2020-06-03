import React, { Component } from 'react';
import { Dispatch, connect } from 'umi';
import { PageHeaderWrapper, GridContent } from '@ant-design/pro-layout';
import { ConnectState } from '@/models/connect';
import TreeMenu from './componests/TreeMenu';
import styles from './style.less';

interface IMySettingsProps {
  dispatch: Dispatch;
}

interface IMySettingsState {
  mode: 'inline' | 'horizontal';
}

class Settings extends Component<IMySettingsProps, IMySettingsState> {
  main: HTMLDivElement | undefined = undefined;

  constructor(props: IMySettingsProps) {
    super(props);
    // eslint-disable-next-line react/no-unused-state
    this.state = { mode: 'inline' };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'current_user/query' });
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

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

      // eslint-disable-next-line react/no-unused-state
      this.setState({ mode });
    });
  };

  renderChildren = () => {
    return null;
  };

  render() {
    return (
      <PageHeaderWrapper title={false}>
        <GridContent>
          <div
            className={styles.main}
            ref={(ref) => {
              if (ref) this.main = ref;
            }}
          >
            <div className={styles.leftMenu}>
              <TreeMenu />
            </div>

            <div className={styles.right}>
              <div className={styles.title}>Hello World!</div>
              {this.renderChildren()}
            </div>
          </div>
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}

// eslint-disable-next-line no-empty-pattern
export default connect(({}: ConnectState) => ({}))(Settings);
