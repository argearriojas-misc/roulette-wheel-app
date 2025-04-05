import React, { useState, useEffect, useRef } from 'react';
import RouletteWheel from './components/RouletteWheel';
import ConfigPanel from './components/ConfigPanel';
import ResultDisplay from './components/ResultDisplay';
import ResultHistory from './components/ResultHistory';
import ResultsHistogram from './components/ResultsHistogram';
import { defaultConfig } from './utils/configLoader';
import { setCookie, getCookie } from './utils/cookieUtils';

// Import modal styles
import './styles/modal.css';
import './styles/buttons.css';

const App = () => {
  const [config, setConfig] = useState(defaultConfig);
  const [result, setResult] = useState(null);
  const [resultHistory, setResultHistory] = useState([]);
  const [showConfig, setShowConfig] = useState(false);
  const [showHistogram, setShowHistogram] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Maximum number of results to keep in history
  const maxHistoryResults = config.ui?.historySize || 10;

  // We'll use a ref to store all results as they come in
  // This persists between re-renders and state updates
  const allResults = useRef([]);

  // Load saved results from cookie on component mount
  useEffect(() => {
    try {
      const savedResultsJson = getCookie('rouletteResults');
      if (savedResultsJson) {
        const savedResults = JSON.parse(savedResultsJson);
        console.log('[App] Loaded saved results from cookie:', savedResults);
        
        if (Array.isArray(savedResults) && savedResults.length > 0) {
          // Set our ref to the saved results
          allResults.current = savedResults;
          
          // Set the latest result
          const latestResult = savedResults[savedResults.length - 1];
          setResult(latestResult);
          
          // Set history (all except the latest)
          if (savedResults.length > 1) {
            const historyResults = savedResults.slice(0, -1);
            const displayHistory = historyResults.reverse().slice(0, maxHistoryResults - 1);
            setResultHistory(displayHistory);
          }
        }
      }
    } catch (error) {
      console.error('[App] Error loading saved results:', error);
    }
  }, [maxHistoryResults]);

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
  
  // Save results to cookie when they change
  useEffect(() => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] State updated - Current result: ${result}`);
    console.log(`[${timestamp}] State updated - Result history:`, JSON.stringify(resultHistory));
    
    // Save all results to cookie
    if (allResults.current.length > 0) {
      try {
        setCookie('rouletteResults', JSON.stringify(allResults.current));
        console.log(`[${timestamp}] Saved results to cookie:`, JSON.stringify(allResults.current));
      } catch (error) {
        console.error(`[${timestamp}] Error saving results to cookie:`, error);
      }
    }
  }, [result, resultHistory]);

  // Toggle config panel visibility
  const toggleConfigPanel = () => {
    setShowConfig(!showConfig);
  };

  // Toggle statistics histogram modal
  const toggleHistogram = () => {
    setShowHistogram(!showHistogram);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold">Argenis' Birthday Roulette</h1>
      
      {/* <ConfigPanel 
        config={config} 
        onConfigChange={setConfig} 
        show={showConfig} 
        onToggleShow={toggleConfigPanel} 
      /> */}
      
      {/* Roulette wheel and history side by side */}
      <div className="flex">
        <div>
          <RouletteWheel 
            config={config} 
            onResult={handleResult}
            onSpinStart={() => setIsSpinning(true)}
            onSpinComplete={() => setIsSpinning(false)}
          />
        </div>
        
        <div className="flex flex-col ml-16">
          <ResultDisplay result={result} />
          <ResultHistory results={resultHistory} maxResults={maxHistoryResults - 1} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="button-container">
        <button 
          className="btn btn-primary"
          onClick={() => {
            setIsSpinning(true);
            // The actual spinning is handled by RouletteWheel's internal animation
            document.dispatchEvent(new CustomEvent('spin-wheel'));
          }}
          disabled={isSpinning}
        >
          {isSpinning ? 'Spinning...' : 'Spin Wheel'}
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={toggleHistogram}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M0 14h16v2H0v-2zm2-10h2v8H2V4zm4 2h2v6H6V6zm4-4h2v10h-2V2z"/>
          </svg>
          Show Statistics
        </button>
      </div>

      {/* Results histogram modal */}
      {showHistogram && (
        <ResultsHistogram 
          results={allResults.current} 
          onClose={toggleHistogram}
        />
      )}
    </div>
  );
};

export default App;