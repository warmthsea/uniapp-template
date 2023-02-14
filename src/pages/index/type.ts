/** item file */
export interface FileItemType {
    /** 创建人 */
    readonly createBy: string;
    /** 创建时间 */
    readonly createTime: string;
    readonly delFlag: string;
    /** 文件ID */
    readonly fileId: string;
    /** 文件名 */
    readonly fileName: string;
    /** 文件路径 */
    filePath: string;
    /** 文件大小 */
    readonly fileSize: number;
    /** 文件类型 */
    readonly fileType: 'swiper' | 'jpg' | 'png' | 'pdf' | 'docx' | 'mp4' | 'mp3' | 'xlsx' | '';
    /** pdf ——> img */
    readonly picFiles?: Array<{
        filePath: string;
        fileName: string;
        width: number;
        height: number;
    }>
    /** mp4、mp3 时长 */
    readonly remark: string;
};

/** file api data about */
export interface FileStateType {
    /** 文件列表 单个文件就一条，照片墙为多条*/
    fileList: Array<FileItemType>;
    /** 文件类型 */
    fileType: FileItemType['fileType'];
    /** 是否读取的本地文件 */
    isStorage: boolean;
    /** 是否预览H5 */
    isPreviewH5: boolean;
};

/** api data */
export interface ApiDataType {
    files?: FileStateType['fileList'];
    notice?: {
        id: string;
        title: string;
        notice: string;
    };
};

/** new webSockt data */
export interface WebSocktNewDataType {
    data: string;
};

export interface PopupType {
    open: (type: 'top' | 'center' | 'right' | 'bottom') => void;
    close: () => void;
};

export interface AppStorageFileType {
    filePath: string;
    createTime: number;
    size: number;
};