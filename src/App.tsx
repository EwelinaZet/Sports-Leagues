import React from 'react';
import SportsLeagues from './components/SportsLeagues';

const App: React.FC = () => {
  return (
    <div data-testid="app-container">
      <SportsLeagues />
    </div>
  );
};

export default App; 