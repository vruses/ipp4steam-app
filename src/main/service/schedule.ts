import { ToadScheduler, Task, LongIntervalJob } from 'toad-scheduler'
import { useHttpClientFactory } from '@main/service/request/client'
import { getOrderList, orderCallbacksFactory } from '@main/service/request/requestService'
import { heartbeat } from '@main/service/request/requestService4Refresh'
import { debounce, flattenDeep, uniqueId } from 'lodash-es'
import { getQueryIntreval, setQueryIntreval } from '@main/service/store'

// 任务调度器
const scheduler = new ToadScheduler()
let schedulerActive = false
let getInterval = getQueryIntreval()
const postInterval = 20 * 60 * 1000

// 创建任务，返回扁平化的任务列表
const createJobs = async (): Promise<LongIntervalJob[]> => {
  const proxies = await useHttpClientFactory()
  // 根据用户和代理的树形关系创建对应爬虫任务
  const jobArray = proxies.map((proxy) => {
    // 请求payload的和请求headers的一些计算
    const cbList = orderCallbacksFactory(proxy)
    const task = new Task('getTask', () => getOrderList(proxy, cbList))
    // const task = new Task('getTask', () => {})
    const job = new LongIntervalJob({ milliseconds: getInterval }, task, { id: uniqueId('getJob') })
    const job2Array = proxy.users.map((user) => {
      return user.proxies.map((proxy2) => {
        const task = new Task('postTask', () => heartbeat(user, proxy2))
        const job = new LongIntervalJob(
          { milliseconds: postInterval, runImmediately: true },
          task,
          {
            id: uniqueId('postJob')
          }
        )
        return job
      })
    })
    return [job, job2Array]
  })
  const jobList = flattenDeep(jobArray)
  return jobList
}
const clearAllJobs = (): void => {
  const allJobs = scheduler.getAllJobs()
  for (const job of allJobs) {
    if (!job?.id) return
    scheduler.removeById(job.id)
  }
}
// 开始所有调度器里的任务
const startAllJobs = (): void => {
  const allJobs = scheduler.getAllJobs()
  for (const job of allJobs) {
    if (!job?.id) return
    scheduler.startById(job.id)
  }
}

// 关闭所有调度器里的任务
const stopAllJobs = (): void => {
  const allJobs = scheduler.getAllJobs()
  for (const job of allJobs) {
    if (!job?.id) return
    scheduler.stopById(job.id)
  }
}

// 更新调度器任务，清空任务，创建任务，再看情况是否关闭任务
const updateAllJobs = (): void => {
  clearAllJobs()
  createJobs()
    .then((jobs) => {
      for (const job of jobs) {
        scheduler.addLongIntervalJob(job)
      }
      schedulerActive ? startAllJobs() : stopAllJobs()
    })
    .catch((e) => {
      console.log(e)
    })
}

const debounceUpdateAllJobs = debounce(updateAllJobs, 5000)

// 设置调度器任务间隔
const setScheduleInterval = async (interval: number): Promise<number> => {
  getInterval = interval
  setQueryIntreval(interval)
  await updateAllJobs()
  return getInterval
}
// 更新调度器状态
const updateScheduleStatus = (status: boolean): number => {
  schedulerActive = status
  const count = scheduler.getAllJobs().length
  // 没有任务时创建任务
  if (!count) {
    updateAllJobs()
  }
  schedulerActive ? startAllJobs() : stopAllJobs()

  return count
}

export {
  createJobs,
  startAllJobs,
  stopAllJobs,
  updateAllJobs,
  debounceUpdateAllJobs,
  setScheduleInterval,
  updateScheduleStatus
}
