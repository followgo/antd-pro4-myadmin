/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request'
import { notification } from 'antd'
import tokenStorage from './tokenStorage'
import { useDispatch } from 'umi'

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

interface IErrorData {
  status: number
  message: string
}

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response, data: IErrorData }): Response => {
  const { response, data: errData } = error

  if (response && response.status) {
    const errorText = errData.message || (codeMessage[response.status] || response.statusText)
    notification.error({ message: `请求错误（${response.status}）`, description: errorText })
  } else if (!response) {
    notification.error({ description: '您的网络发生异常，无法连接服务器', message: '网络异常' })
  }

  return response
}

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  timeout: 1000 * 5,
})

// 请求添加 token
request.interceptors.request.use(async (url, options) => {
  const { access_token = '', refresh_token = '', token_obtain_at = '0', token_type = '', token_expires_in = '0' } = tokenStorage.get()

  if (access_token) {

    if (refresh_token && token_expires_in !== '0') {
      const dispatch = useDispatch();

      // 检查 token 的有效期
      const duration = new Date().getTime() - new Date(token_obtain_at).getTime()  // 单位 ms
      const lifeTime = parseInt(token_expires_in, 10) - duration / 1000
      if (lifeTime < 5) { // 已经过期，或者 5 秒的时间内过期
        await dispatch('logon/refreshAccessToken')

      } else if (lifeTime < 300) { // 5 分钟要过期
        dispatch('logon/refreshAccessToken')
      }
    }




  }


})

export default request
