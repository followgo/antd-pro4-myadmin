// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    // 目标代码兼容 ie11
    // ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './Login',
        },
        {
          component: './Exception/404-ToLogin',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
            },
            {
              name: 'account',
              icon: 'UserOutlined',
              path: '/account',
              routes: [
                {
                  name: 'settings',
                  icon: 'ProfileOutlined',
                  path: '/account/settings',
                  component: './Account/Settings',
                },
                {
                  name: 'management_users',
                  icon: 'ProfileOutlined',
                  path: '/account/management_users',
                  component: './Account/ManagementUsers',
                },
                {
                  component: './Exception/404',
                },
              ],
            }, // 错误页面
            {
              hideInMenu: true,
              // 路由不显示在菜单中
              name: 'exception',
              icon: 'WarningOutlined',
              path: '/exception',
              routes: [
                {
                  path: '/exception/403',
                  name: 'not-permission',
                  icon: 'WarningOutlined',
                  component: './Exception/403',
                },
                {
                  path: '/exception/404',
                  name: 'not-found',
                  icon: 'WarningOutlined',
                  component: './Exception/404',
                },
                {
                  path: '/exception/500',
                  name: 'server-error',
                  icon: 'WarningOutlined',
                  component: './Exception/500',
                },
                {
                  component: './Exception/404',
                },
              ],
            },
            {
              component: './Exception/404',
            },
          ],
        },
        {
          component: './Exception/404',
        },
      ],
    },
    {
      component: './Exception/404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
