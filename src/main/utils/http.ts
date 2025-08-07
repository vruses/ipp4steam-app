import axios, {
  type InternalAxiosRequestConfig,
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type AxiosRequestConfig
} from 'axios'
import ERROR_MESSAGES from './http-config'
import querystring, { type ParsedUrlQueryInput } from 'querystring'

// 递归config，让子配置对象可选
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
class HttpClient {
  private readonly axiosInstance: AxiosInstance

  // 传入可选的axios配置对象
  constructor(config: DeepPartial<InternalAxiosRequestConfig> = {}) {
    this.axiosInstance = axios.create({
      ...config,
      timeout: 20 * 1000,
      maxBodyLength: 5 * 1024 * 1024,
      withCredentials: true
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        return config
      },
      (error: AxiosError) => Promise.reject(error)
    )

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error: AxiosError) => {
        let message = ERROR_MESSAGES.default
        if (!error.response) {
          // Non-HTTP error (e.g., network issue)
          message = error.message.includes('timeout')
            ? '请求超时，请稍后重试！'
            : '网络异常，请检查连接或稍后重试！'
        } else {
          // HTTP error
          const { status } = error.response
          message = ERROR_MESSAGES[status as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.default
        }
        const e = {
          message,
          status: error.response?.status ?? 400
        }
        // logger.error(e)
        return Promise.reject(e)
      }
    )
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config)
    return response.data
  }

  public async post<T>(
    url: string,
    params?: ParsedUrlQueryInput,
    config?: AxiosRequestConfig
  ): Promise<T> {
    // 只支持表单post
    const response = await this.axiosInstance.post<T>(url, querystring.stringify(params), config)
    return response.data
  }

  public async put<T>(url: string, params?: unknown): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, JSON.stringify(params))
    return response.data
  }

  public async delete<T>(url: string, params?: unknown): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, { params })
    return response.data
  }
}

// Export a singleton instance or create new instances as needed
export default HttpClient
