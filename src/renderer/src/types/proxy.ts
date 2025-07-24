import { z } from 'zod'

export const proxySchema = z.object({
  proxyLink: z.string(),
  targetLink: z.string(),
  proxyConfigName: z.string(),
  requestType: z.enum(['get', 'post'])
})
export type ProxyForm = z.infer<typeof proxySchema>
