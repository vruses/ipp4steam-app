import { Cookie } from 'tough-cookie'
import { parseUserInfo } from '@main/service/request/htmlParser'
import type { WebTradeEligibility } from '@main/service/request/cookie/cookie.type'
import type HttpClient from '@main/utils/http'
import { useHeaders } from '@main/service/request/requestConfig'

// 将cookie转化为字符串
export const cookieObjectToString = (cookieObj): string => {
  return Object.entries(cookieObj)
    .map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        // 对象类型 -> 转成 JSON 字符串并 encode
        value = encodeURIComponent(JSON.stringify(value))
      }
      return `${key}=${value}`
    })
    .join(';')
}

// 返回JWT刷新链接
const refreshAccessToken = async (refreshToken: string, client: HttpClient): Promise<string> => {
  const headers = useHeaders('refresh', refreshToken)
  return client
    .getRaw(
      'https://login.steampowered.com/jwt/refresh?redir=https%3A%2F%2Fsteamcommunity.com%2Fmarket%2F',
      {
        headers
      }
    )
    .then((response) => {
      // 从响应头里获取链接
      const location = response.headers['location']
      return location as string
    })
    .catch((err) => {
      console.log('refreshAccessTokenError=>', err)
      throw err
    })
}

// 返回accessToken等属性
// 如果返回那么属性就一定存在
const getAccessToken = async (
  setTokenUrl: string,
  client: HttpClient
): Promise<{
  steamCountry: string
  steamLoginSecure: string
}> => {
  const headers = useHeaders(
    'community',
    `timezoneOffset=28800,0; strInventoryLastContext=578080_2; steamDidLoginRefresh=${Math.floor(Date.now() / 1000)}`
  )
  return client
    .getRaw(setTokenUrl, {
      headers
    })
    .then((response) => {
      if (response.headers['set-cookie']) {
        // 返回{key:value}对象
        const parsedCookies = response.headers['set-cookie'].map((cookieStr) => {
          const cookie = Cookie.parse(cookieStr)
          return cookie ? [cookie.key, cookie.value] : []
        })
        return Object.fromEntries(parsedCookies) as {
          steamCountry: string
          steamLoginSecure: string
        }
      }
      throw new Error('未获取到accessToken')
    })
    .catch((err) => {
      console.log('getAccessTokenError=>', err)
      throw err
    })
}

// 返回用户信息，同时返回sessionid和browserid
// 存在可能未登录的情况如429（返回session，但用户为空）
const getUserAndSession = async (
  accessToken: {
    steamCountry: string
    steamLoginSecure: string
  },
  client: HttpClient
): Promise<{ steamID: string; nickname: string; sessionid: string; browserid: string }> => {
  const headers = useHeaders('community', cookieObjectToString(accessToken))
  return client
    .getRaw('https://steamcommunity.com', {
      headers
    })
    .then((response) => {
      if (response.headers['set-cookie']) {
        // 返回{key:value}对象
        const parsedCookies = response.headers['set-cookie'].map((cookieStr) => {
          const cookie = Cookie.parse(cookieStr)
          return cookie ? [cookie.key, cookie.value] : []
        })
        const sessionInfo = Object.fromEntries(parsedCookies) as {
          sessionid: string
          browserid: string
        }
        const userInfo = parseUserInfo(response.data as string)
        return { ...userInfo, ...sessionInfo }
      }
      throw new Error('未获取到sessionid')
    })
    .catch((err) => {
      console.log('getUserAndSessionError=>', err)
      throw err
    })
}

const webTradeEligibilityGen = (): WebTradeEligibility => {
  const data = {
    allowed: 1,
    allowed_at_time: 0,
    steamguard_required_days: 15,
    new_device_cooldown_days: 0,
    time_checked: Math.floor(Date.now() / 1000) // 当前时间戳
  }
  return data
}

// 集成测试，
export { getAccessToken, refreshAccessToken, getUserAndSession, webTradeEligibilityGen }
