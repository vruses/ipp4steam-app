import type { Proxy } from '@preload/types/proxy'
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

// 删除proxy，返回被删除的proxyName
const deleteProxy = async (proxyName: string): Promise<string> => {
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

export { queryAllProxies, deleteProxy, insertProxy }
