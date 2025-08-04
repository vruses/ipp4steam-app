import type { FlatProxy } from '@preload/types/proxy'

export type ExtendedFlatProxy<K extends string | number | symbol, T> = FlatProxy & {
  [key in K]: T
}
export type UserAuthAndProxies<T> = { steamID: string; cookie: string; proxies: T[] }

export type ProxyUsersTree = FlatProxy & { users: UserAuthAndProxies<FlatProxy>[] }
