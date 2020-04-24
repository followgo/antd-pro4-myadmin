import { MenuDataItem } from '@ant-design/pro-layout'
import { IUserAccount as IUserState } from '@/service/user'
import { IGlobalState } from './global'
import { ISettingState } from './setting'
import { ILoginState } from './login'

export {
  IGlobalState,
  ISettingState,
  IUserState,
  ILoginState,
}

export interface ILoading {
  global: boolean
  effects: { [key: string]: boolean | undefined }
  models: {
    global?: boolean
    menu?: boolean
    setting?: boolean
    current_user?: boolean
    users?: boolean
    login?: boolean
  }
}

export interface ConnectState {
  loading: ILoading
  global: IGlobalState
  settings: ISettingState
  current_user: IUserState
  users: IUserState[]
  login: ILoginState
}




export interface Route extends MenuDataItem {
  routes?: Route[]
}
