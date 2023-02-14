import CONFIG from '../../../config/index.config'
import { ref } from 'vue'
/**
 * 获取设备信息
 */
export const getMacInfo = () => {
  const MACAddress = ref('')
  /** 获取 Mac地址 */
  const getMacAddress = () => {
    if (MACAddress.value) return MACAddress.value
    if (uni.getStorageSync('storage_save_mac')) {
      return uni.getStorageSync('storage_save_mac')
    }

    // #ifdef H5
    console.log('H5：use static MAC link： %c ' + CONFIG.staticMacUrl, 'color:#67c23a;')

    MACAddress.value = CONFIG.staticMacUrl

    uni.setStorage({
      key: 'storage_save_mac',
      data: CONFIG.staticMacUrl,
    })
    return CONFIG.staticMacUrl
    // #endif

    // #ifdef APP
    var net = plus.android.importClass('java.net.NetworkInterface')
    var wl0 = net.getByName('wlan0')
    var macByte = wl0.getHardwareAddress()
    var str = ''
    for (var i = 0; i < macByte.length; i++) {
      var tmp = ''
      var num = macByte[i]
      if (num < 0) {
        tmp = (255 + num + 1).toString(16)
      } else {
        tmp = num.toString(16)
      }
      if (tmp.length == 1) {
        tmp = '0' + tmp
      }
      if (i == macByte.length - 1) {
        str += tmp
      } else {
        str = str + tmp + '-'
      }
    }
    MACAddress.value = str.toUpperCase()
    console.log('APP：MAC', str.toUpperCase())
    uni.setStorage({
      key: 'storage_save_mac',
      data: str.toUpperCase(),
    })
    return str.toUpperCase()
    // #endif
  }

  return {
    getMacAddress,
  }
}
