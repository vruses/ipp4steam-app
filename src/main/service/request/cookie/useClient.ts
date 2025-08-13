import { queryProxyByType } from '@main/mapper/proxyMapper'
import { createHttpClient } from '@main/service/request/client'
import type HttpClient from '@main/utils/http'

const useClient = async (): Promise<HttpClient> => {
  // 用于刷新token的请求客户端
  return await queryProxyByType('post')
    .then((result) => {
      if (result) {
        return createHttpClient('http://127.0.0.1:7890', {
          // 避免跳转和302报错
          maxRedirects: 0,
          validateStatus: function (status) {
            return status >= 200 && status < 303
          }
        })
      } else {
        throw new Error('未查询到代理链接')
      }
    })
    .catch(() => {
      return createHttpClient('', {
        maxRedirects: 0,
        validateStatus: function (status) {
          return status >= 200 && status < 303
        }
      })
    })
}
export default useClient
