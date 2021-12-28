
import React, {useState, useImperativeHandle, forwardRef} from 'react';
import {Select} from 'antd';
import {timeZoneList, TimeZone} from '@/utils/dateAndRandom';
import CSS from './index.less';
const {Option} = Select;
export interface props {
    addList: (key: TimeZone) => void;
}
function AddList({addList}: props, ref: any) {
    const [addType, changeType] = useState(true);
    // ref
    useImperativeHandle(ref, () => ({
        changeType: () => {
            changeType(true);
        },
    }));
    // addicon显示隐藏
    function addListFC(val: string) {
        const curZoneList: any = timeZoneList.find(item => {
            return item.zone === val;
        });
        addList(curZoneList);
        changeType(!addType);
    }
    return (
        <div
            className={CSS.addList}
            onClick={e => {
                e.stopPropagation();
                changeType(false);
            }}
        >
            {
                addType
                    ? (
                        <span className={CSS.addIcon}>+</span>
                    )
                    : (
                        <Select onClick={e => {e.stopPropagation();}} style={{width: 120}} onChange={addListFC}>
                            {
                                timeZoneList.map(item => (
                                    <Option value={item.zone} key={item.zone}>{item.zone}</Option>
                                ))
                            }
                        </Select>
                    )
            }


        </div>
    );
}
export default forwardRef(AddList);
