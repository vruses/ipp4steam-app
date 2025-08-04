import * as cheerio from 'cheerio'

export class CheerioWrapper {
  private $: cheerio.CheerioAPI

  constructor(html: string) {
    this.$ = cheerio.load(html)
  }

  // 获取第一个匹配元素的文本
  getText(selector: string): string {
    return this.$(selector).text().trim()
  }

  // 获取第一个匹配元素的 HTML 内容
  getHTML(selector: string): string | null {
    return this.$(selector).html()
  }

  // 获取第一个匹配元素的某个属性
  getAttr(selector: string, attrName: string): string | undefined {
    return this.$(selector).attr(attrName)
  }

  // 获取所有匹配元素的文本内容
  getAllText(selector: string): string[] {
    return this.$(selector)
      .map((_, el) => this.$(el).text().trim())
      .get()
  }

  // 获取所有匹配元素的某个属性
  getAllAttr(selector: string, attrName: string): string[] {
    return this.$(selector)
      .map((_, el) => this.$(el).attr(attrName))
      .get()
  }

  // 检查是否存在匹配元素
  exists(selector: string): boolean {
    return this.$(selector).length > 0
  }
}
// document.querySelector('a[data-miniprofile]').href.split('/')[4] steamid
// document.querySelector('a[data-miniprofile]').textContent nickname
// 解析用户信息
export const parseUserInfo = (html: string): { steamID: string; nickname: string } => {
  const cheerioWrapper = new CheerioWrapper(html)
  const steamID = cheerioWrapper.getAttr('a[data-miniprofile]', 'href')
  const nickname = cheerioWrapper.getText('a[data-miniprofile]').trim()
  return {
    steamID: steamID?.split('/')[4] ?? '',
    nickname
  }
}
