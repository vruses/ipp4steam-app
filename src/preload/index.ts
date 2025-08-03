import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { windowApi } from './api/window'
import { proxyApi } from '@preload/api/proxy'
import { monitorApi } from '@preload/api/monitor'
import { userApi } from '@preload/api/user'
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('windowApi', windowApi)
    contextBridge.exposeInMainWorld('proxyApi', proxyApi)
    contextBridge.exposeInMainWorld('monitorApi', monitorApi)
    contextBridge.exposeInMainWorld('userApi', userApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.windowApi = windowApi
  // @ts-ignore (define in dts)
  window.proxyApi = proxyApi
  // @ts-ignore (define in dts)
  window.monitorApi = monitorApi
  // @ts-ignore (define in dts)
  window.userApi = userApi
}
