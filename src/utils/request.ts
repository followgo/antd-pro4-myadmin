/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request'
import { history } from 'umi'
import { notification, message } from 'antd'
import { parse as urlParse } from 'url'
import { stringify } from 'querystring'
import tokenStorage, { refreshToken } from './tokenStorage'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

export interface IErrorResponseData {
  status: number
  message: string
}

export interface IBaseResponseData<T = any> {
  status: number
  message: string
  data: T
}

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response, data: IErrorResponseData }): Response => {
  const { response, data: errData } = error

  if (response && response.status) {
    const errorText = errData.message || (codeMessage[response.status] || response.statusText)
    notification.error({ message: `请求错误（${response.status}）`, description: errorText })

    // 非登陆请求的响应遇到 401 错误，则跳转到登陆页面
    if (response.status === 401 && urlParse(response.url).path !== '/user/login/account') {
      const queryString = stringify({ redirect: window.location.href })
      history.push(`/user/login?${queryString}`)
    }

  } else if (!response) {
    notification.error({ description: '您的网络发生异常，无法连接到服务器', message: '网络异常' })
  }

  return response
}

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'omit', // 默认请求是否带上cookie
  timeout: 1000 * 8,
})

// 添加 token, 自动刷新 token
request.interceptors.request.use(async (url, options) => {
  const { access_token = '', token_obtain_at = '0', token_expires_in = '0' } = tokenStorage.get()
  let current_access_token = access_token

  // access_token 为空，则跳过
  if (!access_token) return ({ url, options })

  // 跳过 登陆 和 刷新token 的请求
  if (['/user/login/account', '/user/refresh_token'].indexOf(url) !== -1) return ({ url, options })

  // 检查 token 剩余的生命
  // 如果已经过期，或者立即过期，则刷新 token
  const lifetime = parseInt(token_expires_in, 10) * 1000 - (new Date().getTime() - new Date(token_obtain_at).getTime())
  if (lifetime < 1000 * 10) { // 剩余的生命少于 10 秒
    current_access_token = await refreshToken()
  }

  const { headers = [] } = options
  headers['X-AUTH-TOKEN'] = current_access_token
  return ({ url, options: { ...options, headers } })
})

// 响应拦截，统一提示成功
request.interceptors.response.use((res) => {
  if (res.status === 201) {
    // 登陆，登出，上传文件使用自定义的消息提示
    if (['/user/login/account', '/user/logout', '/api/files/banners'].indexOf(urlParse(res.url).path || '') === -1) {
      message.success(codeMessage[res.status])
    }

  } else if (res.status === 202 || res.status === 204) {
    message.success(codeMessage[res.status])
  }

  return res
})

export default request
