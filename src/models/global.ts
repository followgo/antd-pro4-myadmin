import { Subscription, Reducer } from 'umi'

export interface IGlobalState {
  collapsed: boolean
}

export interface IGlobalModel {
  namespace: 'global'
  state: IGlobalState
  effects: {}
  reducers: {
    changeLayoutCollapsed: Reducer<IGlobalState>
  };
  subscriptions: { setup: Subscription }
}

const Model: IGlobalModel = {
  namespace: 'global',

  state: {
    collapsed: false,
  },

  effects: {},

  reducers: {
    changeLayoutCollapsed(state = { collapsed: true }, { payload }) {
      return { ...state, collapsed: payload }
    },
  },

  subscriptions: {
    setup({ history }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search)
        }
      })
    },
  },
}

export default Model
