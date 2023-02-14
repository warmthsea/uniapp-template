/** 
 *  use test 
*/
import type { Ref } from 'vue';
import type { FileStateType } from '../type';
import CONFIG from "../../../config/index.config";
import { filesList } from "./listData";

export const useTest = (checkFile: Ref<string>, checkIndex: Ref<number>, fileState: FileStateType, handleTab: (link: string) => Promise<void>) => {
    /** 自动测试 */
    const autoDevTest = async (): Promise<void> => {
        console.log('%c 当前处于 autoTest 状态', 'font-size:16px;color:#a8abb2;');
        await handleTab(filesList[0]);
        if (filesList.length == 1) return

        checkIndex.value = 0;
        setInterval(() => {
            checkIndex.value++;
            if (checkIndex.value >= filesList.length) {
                checkIndex.value = 0;
            };
            handleTab(filesList[checkIndex.value]);
        }, CONFIG.times.toggleTimes * 60000);
    };

    return {
        autoDevTest
    };
};
