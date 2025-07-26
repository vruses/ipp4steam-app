import { z } from 'zod'

export const loginPayloadSchema = z.object({
  username: z.string(),
  password: z.string(),
  token: z.string().optional
})
export type LoginPayload = z.infer<typeof loginPayloadSchema>

export const loginResSchema = z.object({
  steamID: z.number(),
  nickname: z.string(),
  loginStatus: z.string()
})
export type LoginRes = z.infer<typeof loginResSchema>

export type UserInfo = LoginRes & {
  proxynameList: string[]
}
