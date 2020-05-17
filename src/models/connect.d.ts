import { MenuDataItem } from '@ant-design/pro-layout'
import { IUserAccount as IUserState } from '@/services/user'
import { IWebsiteBaseSettings as IWebsiteBaseState, IWebsiteIndexSEO as IWebsiteIndexSEOState } from '@/services/website-settings'
import { IWebsiteBanner as IWebsiteBannerState } from '@/services/website-banners'
import { IGlobalState } from './global'
import { ISettingState } from './setting'
import { ILoginState } from './login'

export {
  IGlobalState,
  ISettingState,
  IUserState,
  ILoginState,
  IWebsiteBaseState,
  IWebsiteIndexSEOState,
  IWebsiteBannerState,
}

export interface ILoading {
  global: boolean
  effects: { [key: string]: boolean | undefined }
  models: { [key: string]: boolean | undefined }
}

export interface ConnectState {
  loading: ILoading
  global: IGlobalState
  settings: ISettingState
  current_user: IUserState
  users: IUserState[]
  login: ILoginState
  website_base: IWebsiteBaseState
  website_indexseo: IWebsiteIndexSEOState
  website_banners: IWebsiteBannerState[]
}

export interface Route extends MenuDataItem {
  routes?: Route[]
}
