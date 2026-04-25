import { Provider } from 'react-redux';
import type { AppStore } from './store';
import { WorkbenchProvider } from './context/WorkbenchContext';
import { Workbench } from './components/Workbench';

interface AppProps {
  store: AppStore;
}

function App({ store }: AppProps) {
  return (
    <Provider store={store}>
      <WorkbenchProvider>
        <Workbench />
      </WorkbenchProvider>
    </Provider>
  );
}

export default App;
