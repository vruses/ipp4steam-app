// 创建订单请求的headers，需要携带referer和content-type
export const orderHeaders = {
  Accept: '*/*',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Accept-Language': 'zh-CN,zh;q=0.9',
  Connection: 'keep-alive',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  Host: 'steamcommunity.com',
  Origin: 'https://steamcommunity.com',
  Referer: 'https://steamcommunity.com/market/listings/578080/',
  'Sec-Ch-Ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin'
}
