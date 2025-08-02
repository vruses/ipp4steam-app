import { ipcMain } from 'electron'
import type { Proxy } from '@preload/types/proxy'
import { addProxy, deleteProxy, getAllProxies } from '@main/service/proxy'

function registerProxyIpc(): void {
  ipcMain.handle('query-proxy-list', async () => {
    return await getAllProxies()
  })
  ipcMain.handle('delete-proxy', async (_event, proxyName: string) => {
    return await deleteProxy(proxyName)
  })
  ipcMain.handle('add-proxy', async (_event, proxy: Proxy) => {
    return await addProxy(proxy)
  })
}

export default registerProxyIpc
