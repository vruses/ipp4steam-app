import type { FlatProxy, Proxy } from '@preload/types/proxy'
import type { ProxyUsersTree } from '@preload/types/user-proxy'
import prisma from '@main/mapper/prisma'

// 查询所有的proxy
const queryAllProxies = async (): Promise<Proxy[]> => {
  const proxies = await prisma.proxy.findMany({
    select: {
      configName: true,
      proxyLink: true,
      targetLink: true,
      requestType: true
    }
  })
  return proxies.map((item) => {
    return {
      proxyConfigName: item.configName,
      proxyData: {
        proxyLink: item.proxyLink,
        targetLink: item.targetLink,
        requestType: item.requestType
      }
    }
  })
}

// 查询一个type为post的proxy，如果没有则查询get proxy
const queryProxyByType = async (type: 'get' | 'post'): Promise<FlatProxy | null> => {
  const proxy = await prisma.proxy.findFirst({
    where: {
      requestType: {
        in: ['post', 'get']
      }
    },
    select: {
      proxyLink: true,
      configName: true,
      requestType: true,
      targetLink: true
    },
    orderBy: {
      // post 优先
      requestType: type === 'post' ? 'desc' : 'asc'
    }
  })
  return proxy
}

// 删除proxy，返回被删除的proxyName
const deleteProxyByName = async (proxyName: string): Promise<string> => {
  const proxy = await prisma.proxy.delete({
    where: {
      configName: proxyName
    }
  })
  return proxy.configName
}

// 添加proxy，返回被添加的proxy
const insertProxy = async (proxy: Proxy): Promise<string> => {
  const result = await prisma.proxy.upsert({
    where: {
      configName: proxy.proxyConfigName
    },
    update: {
      proxyLink: proxy.proxyData.proxyLink,
      targetLink: proxy.proxyData.targetLink,
      requestType: proxy.proxyData.requestType
    },
    create: {
      configName: proxy.proxyConfigName,
      proxyLink: proxy.proxyData.proxyLink,
      targetLink: proxy.proxyData.targetLink,
      requestType: proxy.proxyData.requestType
    }
  })
  return result.configName
}

// 查询所有proxy->users->proxies
const queryProxiesWithUserProxies = async (): Promise<ProxyUsersTree[]> => {
  // 查询 type = 'get' 的 proxy
  const getProxies = await prisma.proxy.findMany({
    where: {
      requestType: 'get'
    },
    select: {
      configName: true,
      proxyLink: true,
      targetLink: true,
      requestType: true,
      users: {
        select: {
          user: {
            select: {
              steamID: true,
              cookie: true,
              proxies: {
                where: {
                  proxy: {
                    requestType: 'post'
                  }
                },
                select: {
                  proxy: {
                    select: {
                      configName: true,
                      proxyLink: true,
                      targetLink: true,
                      requestType: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })

  // 转化为p-u-p树
  const upTree = getProxies.map((proxy) => ({
    configName: proxy.configName,
    proxyLink: proxy.proxyLink,
    targetLink: proxy.targetLink,
    requestType: proxy.requestType,
    users: proxy.users.map(({ user }) => ({
      steamID: user.steamID,
      cookie: user.cookie,
      proxies: user.proxies.map((p) => p.proxy)
    }))
  }))

  return upTree
}

export {
  queryAllProxies,
  queryProxyByType,
  deleteProxyByName,
  insertProxy,
  queryProxiesWithUserProxies
}
