import React, { useState, useEffect, useRef } from 'react';
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

  // We'll use a ref to store all results as they come in
  // This persists between re-renders and state updates
  const allResults = useRef([]);

  // Handle result update from wheel
  const handleResult = (newResult) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] handleResult called with: ${newResult}`);
    
    // When we get a new non-null result
    if (newResult !== null) {
      console.log(`[${timestamp}] Processing new non-null result: ${newResult}`);
      
      // Add this result to our ref array
      allResults.current.push(newResult);
      console.log(`[${timestamp}] All results so far:`, JSON.stringify(allResults.current));
      
      // The latest result is displayed in the Last Result box
      setResult(newResult);
      console.log(`[${timestamp}] Setting current result to: ${newResult}`);
      
      // History should be all previous results except the most recent one
      // since that one is shown in the Last Result box
      if (allResults.current.length > 1) {
        // Get all results except the most recent one
        const historyResults = allResults.current.slice(0, -1);
        // Reverse to get newest first, and limit to max history size
        const displayHistory = historyResults.reverse().slice(0, maxHistoryResults - 1);
        console.log(`[${timestamp}] Setting history to:`, JSON.stringify(displayHistory));
        setResultHistory(displayHistory);
      } else {
        console.log(`[${timestamp}] No history to set yet (first result)`);  
      }
    } else {
      console.log(`[${timestamp}] Ignoring null result`);
    }
  };
  
  // For debugging - log when result or history changes
  useEffect(() => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] State updated - Current result: ${result}`);
    console.log(`[${timestamp}] State updated - Result history:`, JSON.stringify(resultHistory));
  }, [result, resultHistory]);

  // Toggle config panel visibility
  const toggleConfigPanel = () => {
    setShowConfig(!showConfig);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 mx-auto max-w-5xl">
      <h1 className="mb-6 text-3xl font-bold">American Roulette Wheel Simulation</h1>
      
      <ConfigPanel 
        config={config} 
        onConfigChange={setConfig} 
        show={showConfig} 
        onToggleShow={toggleConfigPanel} 
      />
      
      {/* Roulette wheel and history side by side */}
      <div className="flex flex-row justify-center items-start w-full gap-4">
        <div className="flex-shrink-0">
          <RouletteWheel config={config} onResult={handleResult} />
        </div>
        
        <div className="flex-shrink-0 flex flex-col">
          <ResultDisplay result={result} />
          <ResultHistory results={resultHistory} maxResults={maxHistoryResults - 1} />
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>The American roulette wheel simulation can be configured using JSON or YAML files.</p>
        <p>Adjust the configuration parameters to customize the physics, timing, and appearance.</p>
        <p>Click "Spin Wheel" to start or enable auto-spin in the configuration.</p>
      </div>
    </div>
  );
};

export default App;