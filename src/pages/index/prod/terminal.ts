/**
 * add Terminal
 */
import { addTerminalApi } from '../../../api/home/home';

export const useSystemTerminal = () => {
    const addTerminal = (token: string) => {
        uni.getSystemInfo({
            success: function (res) {
                addTerminalApi({
                    /** MAC地址 */
                    terminalCode: token,
                    /** 屏幕分辨率 */
                    terminalResolution: res.windowWidth + ' x ' + res.windowHeight,
                    /** 设备型号 */
                    terminalSpec: res.model
                });
            },
        });
    };

    return {
        addTerminal
    };
};