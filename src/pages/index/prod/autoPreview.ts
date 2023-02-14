/** 
 *  use test 
*/
import type { FileStateType } from '../type';
import CONFIG from "../../../config/index.config";
import { ref, computed } from 'vue';
import type { Ref } from 'vue';

export const usePreview = (checkFile: Ref<string>, checkIndex: Ref<number>, fileState: FileStateType, handleTab: (link: string) => Promise<void>) => {

    /** 文件轮播展示 */
    const autoPreview = async (): Promise<void> => {
        await handleTab(fileState.fileList[0].filePath);
        if (fileState.fileList.length == 1) return
        checkIndex.value = 0;
        countTimeToggle(formatTypeTime());
    };

    /** 递归计算切换时间 */
    const countTimeToggle = async (time: number = 1000): Promise<void> => {
        let timer = setTimeout(async () => {
            checkIndex.value++;
            if (checkIndex.value >= fileState.fileList.length) {
                checkIndex.value = 0;
            };
            await handleTab(fileState.fileList[checkIndex.value].filePath);
            countTimeToggle(formatTypeTime());

            window.clearTimeout(timer);
            clearTimeout(timer);
        }, time);
    };

    /** 计算个各个文件类型展示的时间 */
    const formatTypeTime = (): number => {
        if (fileState.fileType == 'pdf') return (fileState.fileList[checkIndex.value]?.picFiles.length || 1) * CONFIG.times.swiperTimes;
        if (['mp4', 'mp3'].includes(fileState.fileType)) return +fileState.fileList[checkIndex.value].remark * 1000;
        if (['xlsx', 'docx'].includes(fileState.fileType)) return 4 * 60 * 1000;
        if (['jpeg', 'png', 'jpg'].includes(fileState.fileType)) return 20 * 1000;
        return 10 * 1000;
    };

    /** 当前文件时间 */
    const checkFileTime = computed(() => {
        if (!checkFile.value) return 0;
        return (formatTypeTime() / 1000 / 60).toFixed(2)
    });

    /** video play not loop */
    const videoEnded = (): void => {
        // #ifdef APP
        if (fileState.fileList.length == 1) {
            if (+fileState.fileList[0].remark > 120) handleTab(fileState.fileList[0].filePath);
        }
        // #endif
    };

    const videoPlayTimer = ref<number>(0);
    /** video play time update */
    const videoUpdate = async (e: { timeStamp: number; type: 'timeupdate' }): Promise<void> => {
        if (fileState.fileList.length == 1) {
            if (+fileState.fileList[0].remark > 120) {
                if (videoPlayTimer.value + 2 > +fileState.fileList[0].remark) {
                    await handleTab(fileState.fileList[0].filePath);
                    videoPlayTimer.value = 0;
                } else {
                    videoPlayTimer.value += 0.25;
                }
            }
        }
    };

    return {
        autoPreview,
        checkFileTime,
        videoEnded,
        videoPlayTimer,
        videoUpdate
    };
}; 