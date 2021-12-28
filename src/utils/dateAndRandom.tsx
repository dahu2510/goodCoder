interface TimeResponse {
    value: number;
}
export interface TimeZone {
    zone: string;
    diff: number;
}
// 时区列表
export const timeZoneList: TimeZone[] = [
    {
        zone: '北京',
        diff: 0,
    },
    {
        zone: '伦敦',
        diff: -8,
    },
    {
        zone: '纽约',
        diff: -13,
    },
    {
        zone: '巴黎',
        diff: -7,
    },
    {
        zone: '东京',
        diff: 1,
    },
    {
        zone: '悉尼',
        diff: 2,
    },
];
function numStr(num: number): string | number {
    return num < 10 ? `0${num}` : num;
}
// 时间戳转日期格式
export function formatDate(time: number): string {
    const date = new Date(time);
    const year = `${date.getFullYear()}-`;
    const month = `${numStr(date.getMonth())}-`;
    const day = `${numStr(date.getDate())} `;
    const hour = `${numStr(date.getHours())}:`;
    const min = `${numStr(date.getMinutes())}:`;
    const second = numStr(date.getSeconds());
    return `${year}${month}${day}${hour}${min}${second}`;
}

// 制造30 % 左右的概率发生异常
function getRandomRate(): boolean {
    return Math.random() > 0.3;
}
// const syncTime = () => Promise<TimeResponse>;
// 该接口在固定0.8秒后返回`TimeResponse`对象，当请求成功时，`value`属性表示当前时间，当请求失败时，该函数会异步地抛出异常（`Promise#reject`），异常包含`message`说明错误原因。
export function syncTime(): Promise<TimeResponse> {
    /* 固定0.8秒延迟。 */
    const DELAY_TIME = 800;
    return new Promise((resolve, reject) => {
        setTimeout(
            () => {
                if (getRandomRate()) {
                    resolve({value: Date.now()});
                } else {
                    const message = '请求失败error';
                    console.error(`${message}`);
                    reject(new Error(`${message}`));
                }
            }, DELAY_TIME);
    });
}
