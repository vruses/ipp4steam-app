import type { SteamCookies } from '@main/service/request/cookie/cookie.type'
import {
  getAccessToken,
  getUserAndSession,
  refreshAccessToken,
  webTradeEligibilityGen
} from '@main/service/request/cookie/token'
import useClient from '@main/service/request/cookie/useClient'
import { cookieObjectToString } from '@main/service/request/cookie/token'

const clientInstance = useClient()

// 刷新token获取accessToken链接
// 尝试登录并获取browserid，sessionid等cookie字段
// 拼接成完整的cookie并返回，同时返回用户信息
const getAccessCookie = async (
  refreshToken: string
): Promise<{
  cookie: string
  user: {
    steamID: string
    nickname: string
  }
}> => {
  const cookie = {
    timezoneOffset: '28800,0',
    strInventoryLastContext: '578080_2'
  }
  // client单例
  const client = await clientInstance

  const setTokenUrl = await refreshAccessToken(refreshToken, client)
  const accessToken = await getAccessToken(setTokenUrl, client)
  const userAndSession = await getUserAndSession(accessToken, client)
  const webTrade = webTradeEligibilityGen()
  const AccessCookie: SteamCookies = {
    ...cookie,
    ...accessToken,
    webTradeEligibility: webTrade,
    sessionid: userAndSession.sessionid,
    browserid: userAndSession.browserid
  }

  return {
    cookie: cookieObjectToString(AccessCookie),
    user: {
      steamID: userAndSession.steamID,
      nickname: userAndSession.nickname
    }
  }
}

export default getAccessCookie
