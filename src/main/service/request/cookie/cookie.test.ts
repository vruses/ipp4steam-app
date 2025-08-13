import type { SteamCookies } from '@main/service/request/cookie/cookie.type'
import {
  getAccessToken,
  getUserAndSession,
  refreshAccessToken,
  webTradeEligibilityGen
} from '@main/service/request/cookie/token'
import useClient from '@main/service/request/cookie/useClient'
import dotenv from 'dotenv'
import { describe, test, expect, expectTypeOf } from 'vitest'

const refreshToken = dotenv.config()?.parsed?.REFRESH_TOKEN as string

describe('getAccessCookie 集成测试', () => {
  test('应该返回正确的cookie', async () => {
    const cookie = {
      timezoneOffset: '28800,0',
      strInventoryLastContext: '578080_2'
    }
    const client = await useClient()

    const setTokenUrl = await refreshAccessToken(refreshToken, client)
    const accessToken = await getAccessToken(setTokenUrl, client)
    const userAndSession = await getUserAndSession(accessToken, client)
    console.log(userAndSession)
    const webTrade = webTradeEligibilityGen()
    const AccessCookie = {
      ...cookie,
      ...accessToken,
      webTradeEligibility: webTrade,
      sessionid: userAndSession.sessionid,
      browserid: userAndSession.browserid
    }
    console.log(AccessCookie)
    expectTypeOf(AccessCookie).toEqualTypeOf<SteamCookies>()
    expect(AccessCookie).toEqual(expect.any(Object))
    Object.values(AccessCookie).forEach((value) => {
      expect(value).not.toBeUndefined()
    })
  })
})
