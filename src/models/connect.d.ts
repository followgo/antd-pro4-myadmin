import { MenuDataItem } from '@ant-design/pro-layout'
import { IGlobalModelState } from './global'
import { ISettingModelState } from './setting'
import { IUserModelState } from './user'
import { ILoginState } from './login'

export { IGlobalModelState, ISettingModelState, IUserModelState }

export interface Loading {
  global: boolean
  effects: { [key: string]: boolean | undefined }
  models: {
    global?: boolean
    menu?: boolean
    setting?: boolean
    user?: boolean
    login?: boolean
  };
}

export interface ConnectState {
  global: GlobalModelState
  loading: Loading
  settings: SettingModelState
  user: UserModelState
  login: ILoginState
}

export interface Route extends MenuDataItem {
  routes?: Route[]
}
