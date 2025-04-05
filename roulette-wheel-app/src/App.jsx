import React, { useState } from 'react';
import RouletteWheel from './components/RouletteWheel';
import ConfigPanel from './components/ConfigPanel';
import ResultDisplay from './components/ResultDisplay';
import ResultHistory from './components/ResultHistory';
import { defaultConfig } from './utils/configLoader';

const App = () => {
  const [config, setConfig] = useState(defaultConfig);
  const [result, setResult] = useState(null);
  const [resultHistory, setResultHistory] = useState([]);
  const [showConfig, setShowConfig] = useState(false);
  
  // Maximum number of results to keep in history
  const maxHistoryResults = config.ui?.historySize || 10;

  // Handle result update from wheel
  const handleResult = (newResult) => {
    setResult(newResult);
    // Add the new result to history (at the beginning)
    if (newResult !== null) {
      setResultHistory(prevHistory => {
        // Create a new array with the new result at the beginning
        const newHistory = [newResult, ...prevHistory];
        // Limit the history size
        return newHistory.slice(0, maxHistoryResults);
      });
    }
  };

  // Toggle config panel visibility
  const toggleConfigPanel = () => {
    setShowConfig(!showConfig);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold">American Roulette Wheel Simulation</h1>
      
      <ConfigPanel 
        config={config} 
        onConfigChange={setConfig} 
        show={showConfig} 
        onToggleShow={toggleConfigPanel} 
      />
      
      <ResultDisplay result={result} show={config.ui.showResult} />
      
      <ResultHistory results={resultHistory} maxResults={maxHistoryResults} />
      
      <RouletteWheel config={config} onResult={handleResult} />
      
      <div className="mt-6 text-sm text-gray-500">
        <p>The American roulette wheel simulation can be configured using JSON or YAML files.</p>
        <p>Adjust the configuration parameters to customize the physics, timing, and appearance.</p>
        <p>Click "Spin Wheel" to start or enable auto-spin in the configuration.</p>
      </div>
    </div>
  );
};

export default App;