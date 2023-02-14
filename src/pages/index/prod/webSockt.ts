import { funAwaitTime } from './../../../utils/utils'
/**
 * use websocket
 */
import type { ApiDataType, WebSocktNewDataType, FileStateType } from '../type'
import CONFIG from '../../../config/index.config'
import { delay, timers } from '../../../utils/timer.js'
import { ref } from 'vue'
import type { Ref } from 'vue'

export const useWebSocket = (
  postApi: (token: string) => void,
  getNoticeData: () => void,
  formatFileState: (data: ApiDataType) => void,
  getMacAddress: () => string,
  fileState: FileStateType,
  readStorageFile: () => void,
  videoPlayTimer: Ref<number>
) => {
  const isHeartbeat = ref<boolean>(false)
  /** is network */
  const netWork = ref<boolean>(false)
  /** webSocket */
  const createWebSocket = async (
    token: string,
    loading: boolean = true
  ): Promise<void> => {
    if (loading)
      uni.showLoading({
        title: '网络连接中',
      })
    console.log('webSocket status connect...')
    uni.closeSocket()
    await funAwaitTime(300)

    uni.connectSocket({
      url: 'ws://' + CONFIG.websocketUrl + '/websocket/' + token,
    })

    uni.onSocketOpen(function (res) {
      delay(() => {
        console.log('%c webSocket status open ！', 'color:#67c23a;')
        if (loading) uni.hideLoading()
        uni.showToast({
          title: '网络连接成功',
          icon: 'none',
          position: 'bottom',
        })
        fileState.isStorage = false
        netWork.value = true
        videoPlayTimer.value = 0

        postApi(token)
        getNoticeData()
      }, 1000)
    })

    //开启心跳检测 仅开启一次
    !isHeartbeat.value && openHeartbeatInter()
  }

  uni.onSocketMessage(function (res: WebSocktNewDataType) {
    console.log('√')
    console.log(JSON.parse(res.data)?.msg)

    if (JSON.parse(res.data).data) {
      formatFileState(JSON.parse(res.data).data as ApiDataType)
    }
    if (JSON.parse(res.data).notice) formatFileState(JSON.parse(res.data) as ApiDataType)
  })

  uni.onSocketError(async function (res) {
    console.log('xxx webSocket connect err')
    uni.showToast({
      title: '当前无网络' + (fileState.isStorage ? '' : '，读取本地文件'),
      icon: 'none',
      position: 'bottom',
    })

    //读取本地文件
    if (!fileState.isStorage) {
      console.log('read storage file')
      await funAwaitTime(300)
      readStorageFile()
    }
  })

  uni.onSocketClose(async function (res) {
    netWork.value = false
    uni.showToast({
      title: '网络连接断开，开始尝试重连',
      icon: 'none',
      position: 'bottom',
    })
    console.log('webSocket connect close！')
    await funAwaitTime(200)
    websocketReconnect(getMacAddress())
  })

  /** 重连webScoket */
  const websocketReconnect = (token: string): void => {
    console.log('reconnec webScoket ')
    createWebSocket(token, false)
  }

  /** 心跳检测 */
  const openHeartbeatInter = (): void => {
    isHeartbeat.value = true
    if (!CONFIG.isStatic) {
      console.log('open heatbeet test...' + CONFIG.times.heartBeatTimes + 'min/次')
      timers(() => {
        uni.sendSocketMessage({
          data: 'reconnect',
          success: res => {
            if (!fileState.isStorage) fileState.isStorage = false
            console.log('❤')
            netWork.value = true
          },
          fail: err => {
            websocketReconnect(getMacAddress())
            console.log('•')
            netWork.value = false
          },
        })
      }, CONFIG.times.heartBeatTimes * 60 * 1000)()
    }
  }

  return {
    createWebSocket,
    websocketReconnect,
    netWork,
  }
}
