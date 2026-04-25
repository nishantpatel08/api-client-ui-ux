import { Provider } from 'react-redux';
import { store } from './store';
import { WorkbenchProvider } from './context/WorkbenchContext';
import { Workbench } from './components/Workbench';

function App() {
  return (
    <Provider store={store}>
      <WorkbenchProvider>
        <Workbench />
      </WorkbenchProvider>
    </Provider>
  );
}

export default App;
