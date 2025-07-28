import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { windowApi } from './api/window'

// Custom APIs for renderer
const api = {
  queryProxyList: () => {
    // const channelName = 'queryProxyList'
    // return ipcRenderer.invoke(channelName).catch((e: Error) => {
    //   return Promise.reject(e)
    // })
    return new Promise((res) => {
      setTimeout(() => {
        res([{ proxyLink: '123', targetLink: '213', proxyConfigName: '321', requestType: 'get' }])
      }, 4000)
    })
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('windowApi', windowApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.windowApi = windowApi
}
