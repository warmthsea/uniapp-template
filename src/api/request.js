import Fly from 'flyio/dist/npm/wx';
import CONFIG from '../config/index.config';

const fly = new Fly();
fly.config.baseURL = CONFIG.baseUrl;

// 添加请求拦截器
fly.interceptors.request.use(
	request => {
		return request;
	},
	function(error) {
		return Promise.reject(error);
	}
);
// 添加响应拦截器
fly.interceptors.response.use(
	res => {
		// uni.showToast({
		// 	title: res.data.msg,
		// 	icon: 'none'
		// });
		return res.data;
	},
	error => {
		return Promise.reject(error);
	}
);

export default fly;
