import React from 'react';
import { getNumberColor } from '../utils/wheelData';
import '../styles/resultDisplay.css';

const ResultDisplay = ({ result }) => {
  
  const getNumberClass = (number) => {
    if (number === 0 || number === '00') return 'number-green';
    const color = getNumberColor(number);
    return color === '#c61b1b' ? 'number-red' : 'number-black';
  };

  return (
    <div className="result-display">
      <h3>Last Result</h3>
      {result !== null ? (
        <div className={`result-number ${getNumberClass(result)}`}>
          {result}
        </div>
      ) : (
        <div className="result-number no-result">
          -
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;