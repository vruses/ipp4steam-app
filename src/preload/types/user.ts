import { z } from 'zod'

export const loginResSchema = z.object({
  steamID: z.number(),
  nickname: z.string(),
  loginStatus: z.enum(['succeed', 'failed'])
})
export type LoginRes = z.infer<typeof loginResSchema>

export type User = LoginRes

export type UserInfo = LoginRes & {
  proxynameList: string[]
}
export type ExpiredAccounts = { failedSteamIDList: UserInfo['steamID'][] }
