import React from 'react'
import { Redirect, connect, ConnectProps } from 'umi'
import Authorized from '@/utils/Authorized'
import { getRouteAuthority } from '@/utils/utils'
import { ConnectState } from '@/models/connect'

interface AuthComponentProps extends ConnectProps {
  isLogin: boolean
}

const AuthComponent: React.FC<AuthComponentProps> = ({
  children,
  route = { routes: [] },
  location = { pathname: '' },
  isLogin,
}) => {
  const { routes = [] } = route
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routes) || ''}
      noMatch={isLogin ? <Redirect to="/exception/403" /> : <Redirect to="/user/login" />}
    >
      {children}
    </Authorized>
  )
}

export default connect(({ login }: ConnectState) => ({
  isLogin: login.access_token !== '',
}))(AuthComponent)
