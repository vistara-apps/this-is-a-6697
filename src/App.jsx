import React from 'react';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-bg">
        <Header />
        <main>
          <Dashboard />
        </main>
      </div>
    </AppProvider>
  );
}

export default App;