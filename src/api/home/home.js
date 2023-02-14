import fly from '../request.js';

/** 根据终端店标识查询展示素材 */
export function getTerminalApi(code) {
	return fly.get('/front/materialTerminal/viewMaterialTerminal/' + code);
};

/** 获取公告 */
export function getNoticeApi(code) {
	return fly.get('/front/materialTerminal/getLatestNotice');
};

/** 新增终端 */
export function addTerminalApi(data) {
	return fly.post('/front/materialTerminal/addTerminal',data);
};
