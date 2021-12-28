import {ClockItemMsg} from '@/modules/ClockTable/index';
import CSS from './index.less';

interface props {
    msg: ClockItemMsg;
    delList: (msg: ClockItemMsg) => void;
}
function ClockList({msg, delList}: props) {
    return (
        <div className={CSS.clockList}>
            <p>{msg.curTimeSpace}</p>
            <p>{msg.curtimeStamp.split(' ')[0]}</p>
            <p>{msg.curtimeStamp.split(' ')[1]}</p>
            <span onClick={() => delList(msg)}>+</span>
        </div>
    );
}
export default ClockList;
