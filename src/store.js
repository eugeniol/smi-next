import { createStore, compose, applyMiddleware } from 'redux';
import reducer from '@ordergroove/smi-store/reducers';
import { createSagaMiddleware } from '@ordergroove/smi-store/utils';

import rootSaga from '@ordergroove/smi-store/sagas';

export default function makeStore() {
  const initialState = {};
  const composeEnhancers =
    // eslint-disable-next-line no-underscore-dangle
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? // eslint-disable-next-line no-underscore-dangle
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        })
      : compose;

  const monitor = window['__SAGA_MONITOR_EXTENSION__'];

  const sagaMiddleware = createSagaMiddleware({ sagaMonitor: monitor });

  const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));

  const store = createStore(reducer, initialState, enhancer);

  sagaMiddleware.run(rootSaga);

  return store;
}
