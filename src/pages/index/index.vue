<template>
  <view class="home-main">
    <view class="home-header">
      <view @click="openPopup()" class="header-logo"
        ><image src="../../static/logo2.png"></image
      ></view>
      <view class="header-marquee">
        <uni-notice-bar
          scrollable
          :speed="70"
          color="#fff"
          :text="checkNotice"
        ></uni-notice-bar>
      </view>
    </view>
    <view class="element-display">
      <view class="element-show">
        <!-- VIDEO 展示 -->
        <video
          v-show="popup_show"
          v-if="fileState.fileType == 'mp4' && checkFile"
          id="myVideos"
          :src="fileState.fileType == 'mp4' ? checkFile : ''"
          :muted="!true"
          :controls="false"
          codec="software"
          object-fit="contain"
          autoplay
          loop
          @ended="videoEnded"
          @timeupdate="videoUpdate"
        ></video>
        <!-- IMG 展示 -->
        <image
          v-if="['jpg', 'png', 'jpeg'].includes(fileState.fileType)"
          :src="checkFile"
          mode="aspectFill"
        ></image>

        <!-- PDF 展示 -->
        <!-- hybrid 文件读取方式请切换至，static -->
        <swiper
          v-if="fileState.fileType == 'pdf'"
          class="swiper"
          @change="swiperChange"
          :indicator-dots="false"
          :autoplay="true"
          :interval="swiperTime"
          :duration="0"
          circular
        >
          <swiper-item
            v-for="(item, index) in fileState.fileType == 'pdf'
              ? formatImage(fileState.fileList[checkIndex]?.picFiles) || imgList
              : []"
            :key="index"
          >
            <image v-if="typeof item == 'string'" :src="item" mode="aspectFit"></image>

            <template v-if="typeof item == 'object'">
              <template v-for="c_item in item">
                <image
                  :class="{ 'custom-image': item.length > 1 }"
                  :src="c_item.filePath"
                  mode="aspectFit"
                ></image>
              </template>
            </template>
          </swiper-item>
        </swiper>

        <!-- MP3 展示 -->
        <AutoQuickPlay
          v-if="['mp3', 'pdf'].includes(fileState.fileType)"
          :url="
            ['mp3', 'pdf'].includes(fileState.fileType)
              ? fileState.fileType == 'pdf'
                ? '../../static/test/background.mp3'
                : checkFile
              : ''
          "
          :type="fileState.fileType"
        ></AutoQuickPlay>

        <!-- WORD 展示 -->
        <web-view
          v-if="fileState.fileType == 'docx'"
          :src="
            CONFIG.serverVueUrl +
            '?link=' +
            checkFile +
            '&notice=' +
            checkNotice +
            '&h5=' +
            fileState.isPreviewH5
          "
        ></web-view>
        <!-- EXCEL 展示 -->
        <web-view
          v-if="fileState.fileType == 'xlsx'"
          :src="
            CONFIG.serverVueUrl +
            '?link=' +
            checkFile +
            '&notice=' +
            checkNotice +
            '&h5=' +
            fileState.isPreviewH5
          "
        ></web-view>
      </view>
      <view v-show="fileState.isPreviewH5" class="element-btn">
        <button
          @click="
            () => {
              handleTab(item.filePath), (checkIndex = index)
            }
          "
          v-for="(item, index) in fileState.fileList"
          :key="index"
        >
          文件{{ index + 1 }}/{{ item.fileType }}
        </button>
      </view>
    </view>

    <uni-popup ref="popup" @change="changePopup" background-color="#fff" type="center">
      <view class="popup-content">
        <uni-collapse accordion>
          <uni-collapse-item title="文件播放相关" :open="true">
            <view>网络状态：{{ netWork ? '已连接' : '断开' }}</view>
            <view>当前文件类型：{{ fileState.fileType }}</view>
            <view>当前第{{ checkIndex + 1 }}个文件：{{ checkFile }}</view>
            <view>当前文件播放时长：{{ checkFileTime }}分钟</view>
            <view>共有文件数：{{ fileState.fileList.length }}</view>
            <view>是否读取本地缓存文件：{{ fileState.isStorage ? '是' : '否' }}</view>
          </uni-collapse-item>
          <uni-collapse-item title="系统信息">
            <view>Mac地址：{{ getMacAddress() }}</view>
            <view>App名称：安全融媒体平台</view>
          </uni-collapse-item>
          <uni-collapse-item title="相关操作">
            <button @click="restartCheckFile()">重新加载当前文件</button>
            <button @click="restartPlus()">重启设备</button>
            <button @click="clearStorageData()">清除缓存</button>
          </uni-collapse-item>
          <uni-collapse-item title="环境切换及配置（重启生效）" open>
            <radio-group>
              <label
                @click="radioChange(index)"
                class="uni-list-cel"
                v-for="(item, index) in URLCONFIG"
                :key="index + 'radio'"
              >
                <view><radio :value="item.name" :checked="index == checkUrl" /></view>
                <view>{{ item.name }}</view>
              </label>
            </radio-group>
            <view class="uni-list-cel uni-list-switch">
              <view class="uni-list-cell-db">单机模式</view>
              <switch
                @change="switchChange($event, 'isStatic')"
                :checked="CONFIG.isStatic"
              />
            </view>
            <view class="uni-list-cel uni-list-switch">
              <view :checked="CONFIG.isRestart" class="uni-list-cell-db">
                是否开启重启模式 {{ CONFIG.times.restartTimes }}分钟/次
              </view>
              <switch
                @change="switchChange($event, 'isRestart')"
                :checked="CONFIG.isRestart"
              />
            </view>
          </uni-collapse-item>
          <uni-collapse-item title="日志" :open="true">
            <view>上次运行时长：{{ (getLogTime / 1000 / 60).toFixed(2) }} 分钟</view>
          </uni-collapse-item>
        </uni-collapse>
      </view>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import CONFIG from '../../config/index.config'
import { URLCONFIG } from '../../config/url.config'
import { imgList } from '../index/dev/listData'

import type { UrlConfigItemType } from '../../config/type'
import type { UiServerType } from './serverUI/type'
import AutoQuickPlay from '../../components/wangding-audioQuickPlay/index.vue'
import { funGetSuffix, funAwaitTime } from '../../utils/utils'

import type { FileStateType } from './type'
import { getMacInfo } from './system/index.js'
import { useSettingTest } from './test'
import { useSettingLog } from './test/log'

/** prod */
import { useApidata, useFormatData } from './prod/index'
import { usePreview } from './prod/autoPreview'
import { useWebSocket } from './prod/webSockt'
import { useSystemTerminal } from './prod/terminal'
/** dev */
import { useTest } from './dev/autoTest'

/** 当前选中的文件 */
const checkFile = ref<string>('')
/** 当前选中的index */
const checkIndex = ref<number>(0)
/** 当前的通知 */
const checkNotice = ref<string>('向违章开战、向陋习说不，反麻痹、守纪律，保人身安全')
/** 当前选中的地址 */
const checkUrl = uni.getStorageSync('storage_url_key') || 0
/** 屏幕高度 */
const windowHeight = ref<number>(0)

/** 当前选中文件列表及类型 */
const fileState = reactive<FileStateType>({
  fileList: [],
  fileType: '',
  isStorage: false,
  isPreviewH5: false,
})

/** 切换显示 */
const handleTab = async (link: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    if (funGetSuffix(link) == funGetSuffix(checkFile.value)) {
      checkFile.value = ''
      fileState.fileType = ''
      await funAwaitTime(500)
    }
    checkFile.value = link
    fileState.fileType = funGetSuffix(checkFile.value) as FileStateType['fileType']
    resolve()
  })
}

// prod use preview
const { autoPreview, checkFileTime, videoEnded, videoPlayTimer, videoUpdate } =
  usePreview(checkFile, checkIndex, fileState, handleTab)

// prod code
const { postApi, getNoticeData, formatFileState, readStorageFile } = useApidata(
  checkNotice,
  fileState,
  autoPreview
)
// use system
const { getMacAddress } = getMacInfo()
// use webSockt
const { netWork, createWebSocket } = useWebSocket(
  postApi,
  getNoticeData,
  formatFileState,
  getMacAddress,
  fileState,
  readStorageFile,
  videoPlayTimer
)
// use terminal
const { addTerminal } = useSystemTerminal()
// use setting test
const {
  popup,
  popup_show,
  openPopup,
  changePopup,
  restartCheckFile,
  restartPlus,
  clearStorageData,
  radioChange,
  switchChange,
} = useSettingTest(checkFile, fileState, handleTab)
// use setting log
const { getLogTime, writeLog } = useSettingLog()
// use format data
const { formatImage, swiperChange, swiperTime } = useFormatData(windowHeight)
//dev
const { autoDevTest } = useTest(checkFile, checkIndex, fileState, handleTab)

onLoad(async (option: UiServerType) => {
  // #ifdef H5
  if (option.type == 'ui_server') {
    fileState.isPreviewH5 = true
    let activeIndex: number = 2
    let active: UrlConfigItemType | undefined = URLCONFIG.find(
      item => window.origin.indexOf(item.name) !== -1
    )
    if (active) activeIndex = active.index
    radioChange(activeIndex)

    getNoticeData()
    postApi(option.token)
    return
  }
  // #endif
  windowHeight.value = (await uni.getSystemInfo()).windowHeight
  console.log(CONFIG.baseUrl)
  if (CONFIG.isStatic) {
    //dev
    autoDevTest()
  } else {
    // prod
    createWebSocket(getMacAddress())
    addTerminal(getMacAddress())
  }

  // #ifdef APP
  let timer = setTimeout(async () => {
    clearTimeout(timer)
    // plus.storage.clear();
    checkFile.value = ''
    fileState.fileType = ''
    await funAwaitTime(1500)
    CONFIG.isRestart && plus.runtime.restart()
  }, CONFIG.times.restartTimes * 60 * 1000)
  // #endif

  writeLog()
})

onShow(() => {
  console.log(
    'onShow current display file link： %c ' + checkFile.value,
    'color:#409eff;'
  )
  // #ifdef APP
  if (fileState.fileType == 'mp4') uni.createVideoContext('myVideos').play()
  // #endif
})
</script>

<style lang="scss" scoped>
@import './index.scss';
p {
  color: rgb(197, 241, 236);
}
</style>
