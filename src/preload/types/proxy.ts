import { z } from 'zod'

// 代理配置名
export const proxyConfigNameSchema = z.string()
// 代理配置数据
export const proxyDataSchema = z.object({
  proxyLink: z.string(),
  targetLink: z.string(),
  requestType: z.enum(['get', 'post'])
})
// 代理配置对象
export const proxySchema = z.object({
  proxyConfigName: z.string(),
  proxyData: proxyDataSchema
})
// 代理配置map
export const proxyMapSchema = z.map(proxyConfigNameSchema, proxyDataSchema)

export type ProxyData = z.infer<typeof proxyDataSchema>
export type Proxy = z.infer<typeof proxySchema>
export type ProxyMap = z.infer<typeof proxyMapSchema>
