import type { UrlConfigItemType } from "./type";

export const URLCONFIG: Array<UrlConfigItemType> = [{
    name: '218',
    baseUrl: 'http://218.6.242.123:18000/prod-api',
    serverVueUrl: 'http://218.6.242.123:18001/file-server',
    websocketUrl: '218.6.242.123:18000/prod-api',
    index: 0
}, {
    name: '172',
    baseUrl: 'http://172.19.11.157:18080',
    serverVueUrl: 'http://192.168.10.133:84/file-server',
    websocketUrl: '172.19.11.157:18080',
    index: 1
}, {
    name: '192',
    baseUrl: 'http://192.168.10.133:18080',
    serverVueUrl: 'http://192.168.10.133:84/file-server',
    websocketUrl: '192.168.10.133:18080',
    index: 2
}];


