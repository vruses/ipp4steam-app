import { z } from 'zod'

export const loginPayloadSchema = z.object({
  username: z.string(),
  password: z.string(),
  token: z.string().optional
})
export type LoginPayload = z.infer<typeof loginPayloadSchema>
