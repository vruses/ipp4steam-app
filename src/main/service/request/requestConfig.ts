import { cloneDeep, random } from 'lodash-es'

const uaList = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0'
]

// 检查登录状态的请求headers，需要保证cookie不能过期
const commonHeaders = {
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Accept-Language': 'zh-CN,zh;q=0.9',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
  Cookie: '',
  Host: 'steamcommunity.com',
  Pragma: 'no-cache',
  'Sec-Ch-Ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': ''
}

// 创建订单请求的headers，需要携带referer和content-type
const orderHeader = {
  Accept: '*/*',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Accept-Language': 'zh-CN,zh;q=0.9',
  Connection: 'keep-alive',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  Cookie: '',
  Host: 'steamcommunity.com',
  Origin: 'https://steamcommunity.com',
  Referer: 'https://steamcommunity.com/market/listings/578080/',
  'Sec-Ch-Ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'User-Agent': ''
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

    // 3. 如果没有 expiration 字段，返回原 cookie
    if (!('expiration' in webTradeEligibility)) {
      return cookie
    }

    // 4. 修改 expiration 字段
    webTradeEligibility.expiration = String(webTradeEligibility.expiration) + '0'

    // 5. 将修改后的对象重新编码为 JSON
    const newWebTradeEligibilityStr = encodeURIComponent(JSON.stringify(webTradeEligibility))

    // 6. 替换原 cookie 中对应字段的值
    const newCookie = cookie.replace(
      /webTradeEligibility=([^;]*)/,
      `webTradeEligibility=${newWebTradeEligibilityStr}`
    )

    return newCookie
  } catch {
    return cookie
  }
}

// 返回创建订单，或者社区主页请求使用的header
const useHeaders = (
  type: 'order' | 'community',
  cookie: string,
  hashName?: string
): Record<string, string> => {
  if (type === 'order') {
    const header = cloneDeep(orderHeader)
    header['User-Agent'] = uaList[random(0, uaList.length - 1)]
    header.Cookie = setWebTradeEligibilityCookie(cookie)

    let referer = header.Referer
    referer = hashName ? referer + encodeURIComponent(hashName) : referer
    header.Referer = referer
    return header
  }
  if (type === 'community') {
    const header = cloneDeep(commonHeaders)
    header['User-Agent'] = uaList[random(0, uaList.length - 1)]
    header.Cookie = setWebTradeEligibilityCookie(cookie)
    return header
  }
  return commonHeaders
}

export {
  setWebTradeEligibilityCookie,
  extractCookieValue,
  commonHeaders,
  marketHashNameMap,
  useHeaders
}
