interface URLType {
    /** 接口请求地址 */
    baseUrl: string;
    /** excel、word 依托依赖地址 */
    serverVueUrl: string;
    /** websocket 地址 */
    websocketUrl: string;
};

interface ConfigItemType extends URLType {
    /** mac 地址 */
    staticMacUrl: string;
    /** 时间相关 */
    times: {
        /** 文件切换时间 / 分钟 */
        toggleTimes: number;
        /** APK重启时间  / 分钟 */
        restartTimes: number;
        /** 心跳检测时间 / 分钟*/
        heartBeatTimes: 0.3;
        /** pdf swiper toggle  time / ms */
        swiperTimes: number;
    };
    /** 是否开启单机模式 */
    isStatic: boolean;
    /** 是否开启重启 */
    isRestart: boolean;
}

/** 配置类型 */
export interface ConfigType {
    [key: string]: ConfigItemType;
};

export interface UrlConfigItemType extends URLType {
    name: string;
    index: number;
};