import { Reducer } from 'umi';
import defaultSettings, { DefaultSettings } from '../../config/defaultSettings'

export interface ISettingState extends DefaultSettings { }

export interface ISettingModel {
  namespace: 'settings'
  state: ISettingState
  reducers: {
    changeSetting: Reducer<ISettingState>
  };
}

const updateColorWeak: (colorWeak: boolean) => void = (colorWeak) => {
  const root = document.getElementById('root')
  if (root) {
    root.className = colorWeak ? 'colorWeak' : ''
  }
};

const Model: ISettingModel = {
  namespace: 'settings',
  state: defaultSettings,
  reducers: {
    changeSetting(state = defaultSettings, { payload }) {
      const { colorWeak, contentWidth } = payload

      if (state.contentWidth !== contentWidth && window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'))
      }
      updateColorWeak(!!colorWeak)
      return {
        ...state,
        ...payload,
      };
    },
  },
};
export default Model
