import React, {useState, useEffect, useRef} from 'react';
import ClockList from '@/components/ClockList';
import AddList from '@/components/AddList';
import {formatDate, syncTime} from '@/utils/dateAndRandom';
import CSS from './index.less';
export interface ClockItemMsg {
    curTimeSpace: string;
    clockSpaceID: number;
    curtimeStamp: string;
    diff: number;
}
function ClockTable() {
    const [clockMsgList, changeList] = useState<ClockItemMsg[]>([]);
    const [curtimeStamp, changeTimeStamp] = useState<number>(0);
    const addListRef: any = useRef(null);
    // 更新所有时区当前时间点
    function changeCurTime(num: number) {
        const newClockMsgList = clockMsgList.map(item => {
            // 时间戳转YYYY-MM-DD HH:mm:ss格式
            item.curtimeStamp = formatDate(curtimeStamp + 60 * 60 * item.diff * 1000 + num * 1000);
            return item;
        });
        changeList(newClockMsgList);
    }
    // 同步服务端SyncTime时间
    function getSyncTime() {
        syncTime().then(res => {
            // 将同步时间点校正至秒
            setTimeout(() => {
                changeTimeStamp(res.value);
            }, 1000 - res.value % 1000);
        }).catch(() => {
            changeTimeStamp(0);
        });
    }
    // 初始化每60s同步一次服务端时间
    useEffect(() => {
        getSyncTime();
        const getsyncTime = setInterval(() => {
            getSyncTime();
        }, 1000 * 60);
        // 本地持久化存储（使用`localStorage`），用户关闭页面后打开可恢复
        const localClockMsgList = JSON.parse(localStorage.getItem('clockMsgList') || '0');
        if (localClockMsgList) {
            changeList([...localClockMsgList]);
        }
        // 页面信息需要在多个浏览器标签页间同步
        window.addEventListener('storage', e => {
            if (JSON.parse(e.newValue || '0')) {
                changeList([...JSON.parse(e.newValue || '0')]);
            }
        });
        return () => {
            clearInterval(getsyncTime);
        };
    }, []
    );
    useEffect(() => {

        if (curtimeStamp) {
            // 时钟以1秒为单位自行改变时钟的显示
            let num: number = 0;
            changeCurTime(num);
            const getCurTime = setInterval(() => {
                num++;
                changeCurTime(num);
            }, 1000);
            return () => {
                clearInterval(getCurTime);
            };
        }
    }, [curtimeStamp, clockMsgList.length]
    );


    // 新增时区
    function addList(res: any): void {
        const newClockMsgList: ClockItemMsg[] = [...clockMsgList, {
            curTimeSpace: res.zone,
            curtimeStamp: formatDate(Date.now()),
            clockSpaceID: Date.now(),
            diff: res.diff,
        }];
        changeList(newClockMsgList);
        localStorage.setItem('clockMsgList', JSON.stringify(newClockMsgList));
    }
    // 删除时区
    function delList(msg: ClockItemMsg) {
        const curIdx = clockMsgList.findIndex(item => {
            return item.clockSpaceID === msg.clockSpaceID;
        });
        if (curIdx > -1) {
            const newClockMsgList = clockMsgList.map(item => item);
            newClockMsgList.splice(curIdx, 1);
            changeList([...newClockMsgList]);
            localStorage.setItem('clockMsgList', JSON.stringify(newClockMsgList));
        }
    }
    return (
        <div className={CSS.clockTable} onClick={() => {addListRef.current.changeType();}}>
            {
                clockMsgList.map(item => (
                    <ClockList key={item.clockSpaceID} msg={item} delList={delList} />
                )
                )
            }
            <AddList addList={addList} ref={addListRef} />
        </div>
    );
}
export default ClockTable;
