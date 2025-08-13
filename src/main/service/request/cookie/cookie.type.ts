interface WebTradeEligibility {
  allowed: number
  allowed_at_time: number
  steamguard_required_days: number
  new_device_cooldown_days: number
  time_checked: number
}

interface SteamCookies {
  timezoneOffset: string //固定28800中国时区
  strInventoryLastContext: string //578080_2
  browserid: string //请求社区主页获取
  sessionid: string //请求社区主页获取
  steamCountry: string //请求accessToken时顺便获取
  steamLoginSecure: string //accessToken
  webTradeEligibility: WebTradeEligibility //固定，伪造time_checked时间戳即可
}

export type { SteamCookies, WebTradeEligibility }
