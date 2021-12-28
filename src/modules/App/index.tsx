import {lazy, Suspense} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import './index.less';
const ClockTable = lazy(() => import('@/modules/ClockTable'));

const App = () => {
    return (
        <Suspense fallback={null}>
            <Switch>
                <Route path="/" component={ClockTable} />
                <Redirect to="/" />
            </Switch>
        </Suspense>
    );
};

export default App;
