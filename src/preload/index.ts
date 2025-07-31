import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { windowApi } from './api/window'
import { proxyApi } from '@preload/api/proxy'

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('windowApi', windowApi)
    contextBridge.exposeInMainWorld('proxyApi', proxyApi)
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
  // @ts-ignore (define in dts)
  window.proxyApi = proxyApi
}
