import type { ConfigType } from './type';
import { URLCONFIG } from './url.config';

const index = uni.getStorageSync('storage_url_key') || 0;

const CONFIG: ConfigType = {
	// 开发环境配置
	development: {
		baseUrl: URLCONFIG[index].baseUrl,
		serverVueUrl: URLCONFIG[index].serverVueUrl,
		websocketUrl: URLCONFIG[index].websocketUrl,
		// staticMacUrl: '08-00-27-44-A1-78',
		staticMacUrl: '08-00-27-BB-A6-3C',
		times: {
			toggleTimes: 15,
			restartTimes: 100,
			heartBeatTimes: 0.3,
			swiperTimes: 10000
		},
		isStatic: uni.getStorageSync('storage_isStatic_key') || false,
		isRestart: uni.getStorageSync('storage_isRestart_key') || true,
	},
	// 生产环境配置
	production: {
		baseUrl: URLCONFIG[index].baseUrl,
		serverVueUrl: URLCONFIG[index].serverVueUrl,
		websocketUrl: URLCONFIG[index].websocketUrl,
		staticMacUrl: null,
		times: {
			toggleTimes: 15,
			restartTimes: 100,
			heartBeatTimes: 0.3,
			swiperTimes: 10000
		},
		isStatic: uni.getStorageSync('storage_isStatic_key') || false,
		isRestart: uni.getStorageSync('storage_isRestart_key') || true,
	}

};

export default CONFIG[process.env.NODE_ENV];

