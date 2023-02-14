import { funAwaitTime } from './../../../utils/utils';
/**
 * use prod api data
 */

import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import type { FileStateType, ApiDataType, FileItemType, AppStorageFileType } from '../type';
import { getTerminalApi, getNoticeApi } from '../../../api/home/home';
import CONFIG from "../../../config/index.config";

export const useApidata = (checkNotice: Ref<string>, fileState: FileStateType, autoPreview: () => void) => {
    const postApi = (token: string): void => {
        getTerminalApi(token).then((res: { data: ApiDataType }) => {
            formatFileState(res.data)
        });
    };

    /** get notice */
    const getNoticeData = (): void => {
        getNoticeApi().then((res: { data: ApiDataType['notice'] }) => {
            formatFileState({
                notice: {
                    ...res.data
                } as ApiDataType['notice']
            });
        });
    };

    /** format fileState  */
    const formatFileState = (data: ApiDataType): void => {
        if (data.files) {
            if (data.files.length == 0) {
                uni.showToast({
                    title: '无数据',
                    duration: 2000,
                    icon: 'none'
                });
            } else {
                console.log(data.files);
                fileState.isStorage = false;
                fileState.fileList = data.files;

                autoPreview();

                // #ifdef APP
                let file_link: string = fileState.fileList[0].filePath;
                if (fileState.fileList[0].fileType == 'pdf') {
                    file_link = fileState.fileList[0].picFiles[0].filePath;
                };

                if (!/uniapp_save/.test(file_link) && !filesSaveExist()) loadingStorgeFile();
                // #endif
            };
        } else if (data.notice) {
            checkNotice.value = data.notice.title;
            uni.setStorage({
                key: 'storage_save_notice_key',
                data: data.notice.title
            });
        }
    };

    /** 读取本地文件、通知 */
    const readStorageFile = async (): Promise<void> => {
        checkNotice.value = uni.getStorageSync('storage_save_notice_key');

        await funAwaitTime(200);
        uni.getSavedFileList({
            success: async function (res) {
                console.log('read file fun success');
                await funAwaitTime(200);
                let is_match: boolean = matchFiles(res.fileList);
                console.log('is_match', is_match);
                await funAwaitTime(200);
                if (res.fileList.length > 0 && is_match) {
                    fileState.isStorage = true;
                    fileState.fileList = Object.values(uni.getStorageSync('storage_save_file_key'));
                    console.log(fileState.fileList);
                    autoPreview();
                } else {
                    fileState.isStorage = true;
                    uni.showToast({
                        title: is_match ? '本地文件丢失，请联网' : '存储地址与文件地址发生了不匹配，请联网',
                        icon: 'none',
                        position: 'bottom',
                        duration: 8000
                    });
                };
            }
        });
    };

    /** 测试文件是否已经被存储 */
    const filesSaveExist = (): boolean => {
        let storage_save_list: FileItemType[] = Object.values(uni.getStorageSync('storage_save_file_key'));
        if (storage_save_list.length !== fileState.fileList.length) {
            console.log('checked file save exist: false');
            return false;
        };
        let same: boolean = fileState.fileList.some((item, index) => storage_save_list[index].fileId == item.fileId);
        console.log(`checked file save exist: ${same}`);
        return same;
    };

    /** 本地存储文件是否存在异常匹配 */
    const matchFiles = (storageFileList: Array<AppStorageFileType>): boolean => {
        let storage_save_list: FileItemType[] = Object.values(uni.getStorageSync('storage_save_file_key'));
        console.log(storage_save_list);
        return storage_save_list.some(itm => {
            if (itm.fileType !== 'pdf') {
                return storageFileList.some(s_itm => s_itm.filePath == itm.filePath);
            } else {
                return itm.picFiles.some(i_item => storageFileList.some(s_itm => s_itm.filePath == i_item.filePath));
            };
        });
    };

    /** 测试存储本地 */
    const loadingStorgeFile = async (): Promise<void> => {
        await funAwaitTime(500);
        await deleteStorageFile();
        console.log('delete all success');
        let storageList: Array<FileItemType> = Object.assign([], fileState.fileList);
        // static doesn't read xlsx、docx server
        storageList = storageList.filter(itm => !['docx', 'xlsx'].includes(itm.fileType));

        try {
            for (let i in fileState.fileList) {
                if (fileState.fileList[i].fileType == 'pdf') {
                    for (let j in fileState.fileList[i].picFiles) {
                        storageList[i].picFiles[j].filePath = await saveStorageFile(fileState.fileList[i].picFiles[j].filePath);
                        await funAwaitTime(600);
                    }
                } else {
                    await funAwaitTime(600);
                    storageList[i].filePath = await saveStorageFile(fileState.fileList[i].filePath);
                };
            };

            await funAwaitTime(600);
            await uni.setStorage({
                key: 'storage_save_file_key',
                data: storageList
            });

            console.log('save file in storage success !');
            uni.showToast({
                title: '文件已存储至本地',
                icon: 'none',
                position: 'bottom'
            });
        } catch (e) {
            console.log('save file in storage error !');
        };
        // console.log(uni.getStorageSync("storage_save_file_key"));
    };

    /** 保存File到本地缓存 */
    const saveStorageFile = (link: string): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            await uni.downloadFile({
                url: link,//下载地址接口返回
                success: async (data: { statusCode: number; tempFilePath: any; }) => {
                    if (data.statusCode === 200) {
                        //文件保存到本地
                        await uni.saveFile({
                            tempFilePath: data.tempFilePath, //临时路径
                            success: function (res: { savedFilePath: string | PromiseLike<string>; }) {
                                resolve(res.savedFilePath);
                            }
                        });
                    }
                }
            });
        });
    };

    /** 删除本地缓存的File */
    const deleteStorageFile = async (): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            await uni.getSavedFileList({
                success: async function (res) {
                    if (res.fileList.length > 0) {
                        for (let i in res.fileList) {
                            await uni.removeSavedFile({
                                filePath: res.fileList[i].filePath,
                                complete: function (res_c: any) {
                                    if ((res.fileList.length - 1) == Number(i)) resolve();
                                }
                            });
                        };
                    } else {
                        resolve();
                    };
                }
            });
        })
    };

    return {
        postApi, getNoticeData,
        formatFileState,
        readStorageFile,
    };
};


export const useFormatData = (windowHeight: Ref<number>) => {
    const formatImageList = ref<Array<FileItemType["picFiles"]>>([]);
    /** format PDF image */
    const formatImage = computed(() => {
        return function (list: FileItemType["picFiles"]): Array<FileItemType["picFiles"]> {
            if (!list) return undefined;
            let newList: Array<FileItemType["picFiles"]> = [];
            let levelList: FileItemType["picFiles"] = [];
            list.forEach((item, index) => {
                let proportion: number = item.height / item.width;
                if (proportion > 0.75 || windowHeight.value < 730) {
                    newList.push([item]);
                } else {
                    levelList.push(item);
                    if (levelList.length == 3 || index === list.length - 1) {
                        newList.push(levelList);
                        levelList = [];
                    }
                }
            });
            formatImageList.value = newList;
            return newList;
        };
    });

    const swiperTime = ref<number>(CONFIG.times.swiperTimes);
    const swiperChange = (e: { detail: { current: number; }; }): void => {
        if (windowHeight.value < 730) return
        swiperTime.value = formatImageList.value[e.detail.current > formatImageList.value.length ? 0 : e.detail.current].length > 1 ? CONFIG.times.swiperTimes * 3 : CONFIG.times.swiperTimes;
    };

    return {
        formatImage,
        swiperChange, swiperTime
    };
};