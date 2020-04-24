import React from 'react';
import { PageLoading } from '@ant-design/pro-layout'
import { Redirect, connect, ConnectProps } from 'umi'
import { stringify } from 'querystring'
import { ConnectState } from '@/models/connect'
import tokenStorage, { ITokenStorage } from '@/utils/tokenStorage';

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean
}

interface SecurityLayoutState {
  isReady: boolean
  loginStatus?: ITokenStorage
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
    loginStatus: tokenStorage.get()
  }

  componentDidMount() {
    const { loginStatus } = this.state;
    const loginOk = loginStatus?.login_status === 'ok'
    if (loginOk) {
      const { dispatch } = this.props
      if (dispatch) {
        dispatch({ type: 'current_user/fetchMySettings' })
      }

      this.setState({ isReady: true })
    }
  }

  render() {
    const { isReady, loginStatus } = this.state;
    const { children, loading } = this.props
    const loginOk = loginStatus?.login_status === 'ok'

    const queryString = stringify({
      redirect: window.location.href,
    });

    if (!loginOk && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />;
    }
    if ((!loginOk && loading) || !isReady) {
      return <PageLoading />
    }
    return children
  }
}

export default connect(({ loading }: ConnectState) => ({
  loading: loading.models.user,
}))(SecurityLayout)
