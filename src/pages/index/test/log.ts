/**
 * log code 
 */
import { timers } from '../../../utils/timer.js'

export const useSettingLog = () => {

    const getLogTime: number = uni.getStorageSync('storage_log_time_key') || 0;

    const writeLog = () => {
        let timer = setTimeout(() => {
            clearTimeout(timer);
            uni.removeStorageSync('storage_log_time_key');
        }, 999)

        timers(() => {
            uni.setStorage({
                key: 'storage_log_time_key',
                data: +uni.getStorageSync('storage_log_time_key') + 1000
            });
        }, 1000)();
    };

    return {
        getLogTime,
        writeLog
    };
};