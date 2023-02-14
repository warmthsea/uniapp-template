/**
 * test code
 */
import { ref } from 'vue';;
import type { Ref } from 'vue';;
import type { PopupType, FileStateType } from '../type';
import { funAwaitTime } from "../../../utils/utils";

export const useSettingTest = (checkFile: Ref<string>, fileState: FileStateType, handleTab: (link: string) => Promise<void>) => {
    const popup = ref<PopupType>();
    const popup_show = ref<boolean>(true);

    const openPopup = async (): Promise<void> => {
        uni.showToast({
            title: '点击调试窗口',
            icon: 'none',
            position: 'bottom'
        });
        await funAwaitTime(200);
        try {
            popup.value.open('center');
        } catch (error) {
            uni.showToast({
                title: '调试窗口打开异常',
                icon: 'none',
                position: 'bottom'
            });
        }
    };

    const changePopup = (e: { show: boolean }) => {
        uni.showToast({
            title: e.show ? '调试窗口打开' : '调试窗口关闭',
            icon: 'none',
            position: 'bottom'
        });
        // #ifdef APP
        if (fileState.fileType == 'mp4' && e.show) popup_show.value = false;
        if (fileState.fileType == 'mp4' && !e.show) popup_show.value = true;
        // #endif
    };

    /** 重新加载数据 */
    const restartCheckFile = (): void => {
        console.log('重新查看当前文件');
        popup.value.close();
        handleTab(checkFile.value);
        uni.showToast({
            title: '重新加载成功',
            icon: 'none',
        });
    };

    const restartPlus = async (): Promise<void> => {
        popup.value.close();
        uni.showToast({
            title: '即将重启设备',
            icon: 'none',
        });
        await funAwaitTime(1500);
        // #ifdef APP
        plus.runtime.restart();
        // #endif
    };

    const clearStorageData = (): void => {
        // #ifdef APP
        plus.storage.clear();
        // #endif
        // uni.clearStorage();
        uni.showToast({
            title: '清除缓存成功',
            icon: 'none',
        });
    };

    const radioChange = (index: number): void => {
        uni.setStorage({
            key: 'storage_url_key',
            data: index
        });
        console.log(uni.getStorageSync('storage_url_key'));
    };

    const switchChange = (e: any, name: 'isStatic' | 'isRestart'): void => {
        uni.setStorage({
            key: 'storage_' + name + '_key',
            data: e.detail.value
        });
    };

    return {
        popup, popup_show, openPopup, changePopup,
        restartCheckFile,
        restartPlus,
        clearStorageData,
        radioChange,
        switchChange
    };
};