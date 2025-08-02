import { setScheduleInterval, updateScheduleStatus } from '@main/service/schedule'
import type { ResultType } from '@preload/types/api'

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
        code: 0,
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

export { updateMonitorStatus, updateIntreval }
