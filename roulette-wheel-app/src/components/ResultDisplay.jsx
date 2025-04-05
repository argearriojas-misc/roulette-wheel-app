import React from 'react';
import { getNumberColor } from '../utils/wheelData';
import '../styles/resultDisplay.css';

const ResultDisplay = ({ result, show }) => {
  if (!show || result === null) return null;
  
  const getNumberClass = (number) => {
    if (number === 0 || number === '00') return 'number-green';
    const color = getNumberColor(number);
    return color === '#c61b1b' ? 'number-red' : 'number-black';
  };

  return (
    <div className="result-display">
      <h3>Current Result</h3>
      <div className={`result-number ${getNumberClass(result)}`}>
        {result}
      </div>
    </div>
  );
};

export default ResultDisplay;