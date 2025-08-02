import { ToadScheduler, Task, LongIntervalJob } from 'toad-scheduler'
import { getOrderList, heartbeat, useHttpClientFactory } from '@main/service/client'
import { flattenDeep, uniqueId } from 'lodash-es'

// 任务调度器
const scheduler = new ToadScheduler()

// 创建任务，返回扁平化的任务列表
const createJobs = async (): Promise<LongIntervalJob[]> => {
  const proxies = await useHttpClientFactory()
  // 根据用户和代理的树形关系创建对应爬虫任务
  const jobArray = proxies.map((proxy) => {
    const task = new Task(uniqueId('getTask'), () => getOrderList(proxy))
    const job = new LongIntervalJob({ milliseconds: 1000 }, task)
    const job2Array = proxy.users.map((user) => {
      return user.proxies.map((proxy2) => {
        const task = new Task(uniqueId('postTask'), () => heartbeat(proxy2))
        const job = new LongIntervalJob({ milliseconds: 2000 }, task)
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
      // stopAllJobs()
    })
    .catch((e) => {
      console.log(e)
    })
}

export { createJobs, startAllJobs, stopAllJobs, updateAllJobs }
