import React from 'react';
import { PageLoading } from '@ant-design/pro-layout'
import { Redirect, connect, ConnectProps } from 'umi'
import { stringify } from 'querystring'
import { ConnectState } from '@/models/connect'

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean
  loginOk: boolean,
}

interface SecurityLayoutState {
  isReady: boolean
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  }

  componentDidMount() {
    const { loginOk } = this.props
    if (loginOk) {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({ type: 'user/fetchMySettings' })
      }

      this.setState({ isReady: true })
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, loginOk } = this.props
    const queryString = stringify({
      redirect: window.location.href,
    });

    if (!loginOk && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />;
    }
    if ((!loginOk && loading) || !isReady) {
      return <PageLoading />;
    }
    return children;
  }
}

export default connect(({ login, loading }: ConnectState) => ({
  loginOk: login.login_status === 'ok',
  loading: loading.models.user,
}))(SecurityLayout);
