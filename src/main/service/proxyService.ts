import { queryAllProxies, deleteProxyByName, insertProxy } from '@main/mapper/proxyMapper'
import type { ResultType } from '@preload/types/api'
import type { Proxy } from '@preload/types/proxy'
import { updateAllJobs } from '@main/service/schedule'

// 获取所有代理时
const getAllProxies = (): Promise<ResultType<Proxy[]>> => {
  return queryAllProxies()
    .then((result) => {
      // 初始化定时任务
      updateAllJobs()
      return { code: 0, msg: 'success', data: result }
    })
    .catch(() => {
      return { code: -1, msg: 'fail', data: [] }
    })
}

// 删除对应代理时
const deleteProxy = (proxyName: string): Promise<ResultType<string>> => {
  return deleteProxyByName(proxyName)
    .then((result) => {
      // 代理变更，更新定时任务
      updateAllJobs()
      return { code: 0, msg: 'success', data: result }
    })
    .catch(() => {
      return { code: -1, msg: 'fail', data: '' }
    })
}

// 添加对应代理时
const addProxy = (proxy: Proxy): Promise<ResultType<string>> => {
  return insertProxy(proxy)
    .then((result) => {
      // 代理变更，更新定时任务
      updateAllJobs()
      return { code: 0, msg: 'success', data: result }
    })
    .catch(() => {
      return { code: -1, msg: 'fail', data: '' }
    })
}

export { getAllProxies, deleteProxy, addProxy }
