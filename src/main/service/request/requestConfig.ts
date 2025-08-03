// 检查登录状态的请求headers，需要保证cookie不能过期
// 创建订单请求的headers，不强制携带检查cookie过期的字段，但需要携带referer和content-type
const commonHeaders = {
  accept: '*/*',
  'accept-language': 'en,zh-TW;q=0.9,zh-CN;q=0.8,zh;q=0.7',
  'cache-control': 'no-cache',
  pragma: 'no-cache',
  'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'none',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
  Referer: 'https://steamcommunity.com/market',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  cookie: ''
}

// itemid与itemname的映射
const marketHashNameMap = {
  176003279: 'Reaper Mask',
  176003275: 'Survivalist Slacks',
  // 测试链接
  175882811: 'Combat Pants (Blue)'
}

// 提取cookie字段
const extractCookieValue = (cookie: string, name: string): string => {
  const cookies = cookie.split('; ')
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=')
    if (key === name) {
      return decodeURIComponent(value)
    }
  }
  return ''
}

// 重新设置cookie过期时间
const setWebTradeEligibilityCookie = (cookie: string): string => {
  try {
    // 1. 提取 webTradeEligibility 字段的值
    const webTradeEligibilityStr = extractCookieValue(cookie, 'webTradeEligibility')
    // 2. 解析为 JSON
    const webTradeEligibility = JSON.parse(webTradeEligibilityStr)
    // 3. 修改 expiration 字段
    webTradeEligibility.expiration = String(webTradeEligibility.expiration) + '0'
    // 4. 将修改后的对象重新编码为 JSON
    const newWebTradeEligibilityStr = encodeURIComponent(JSON.stringify(webTradeEligibility))
    // 5. 替换原 cookie 中对应字段的值
    const newCookie = cookie.replace(
      /webTradeEligibility=([^;]*)/,
      `webTradeEligibility=${newWebTradeEligibilityStr}`
    )
    return newCookie
  } catch {
    return cookie
  }
}

export { setWebTradeEligibilityCookie, extractCookieValue, commonHeaders, marketHashNameMap }
