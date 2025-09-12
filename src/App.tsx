import Router from './Router';
import { ErrorBoundary } from './components';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}

export default App;
