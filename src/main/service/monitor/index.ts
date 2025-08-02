import { setScheduleInterval, updateScheduleStatus } from '@main/service/schedule'
import type { ResultType } from '@preload/types/api'
import { observer } from '@main/ipc/monitor'
import { setExpectedPrice } from '@main/service/client'
import { getMonitorConfig } from '@main/service/store'

// 更新调度器执行间隔
const updateIntreval = (interval: number): Promise<ResultType<number>> => {
  return setScheduleInterval(interval)
    .then((result) => {
      return {
        code: 0,
        msg: 'success',
        data: result
      }
    })
    .catch(() => {
      return {
        code: -1,
        msg: 'fail',
        data: 0
      }
    })
}

// 开启或者关闭调度器
const updateMonitorStatus = (status: boolean): ResultType<boolean> => {
  try {
    const res = updateScheduleStatus(status)
    return {
      code: 0,
      msg: 'success',
      data: res
    }
  } catch {
    return {
      code: -1,
      msg: 'success',
      data: false
    }
  }
}

//推送最新消息
const notifyNews = (data): void => {
  observer.notify('notify:news', data)
}

const updatePrice = (price: number): ResultType<number> => {
  try {
    const result = setExpectedPrice(price)
    return {
      code: 0,
      msg: 'success',
      data: result
    }
  } catch {
    return {
      code: -1,
      msg: 'fail',
      data: 0
    }
  }
}
const getConfig = (): ResultType<{
  queryInterval: number
  expectedPrice: number
}> => {
  return {
    code: 0,
    msg: 'success',
    data: getMonitorConfig()
  }
}
export { updateMonitorStatus, updateIntreval, notifyNews, updatePrice, getConfig }
