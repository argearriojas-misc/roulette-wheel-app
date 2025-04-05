import React from 'react';
import { getNumberColor } from '../utils/wheelData';
import '../styles/resultHistory.css';

const ResultHistory = ({ results = [], maxResults = 10 }) => {
  if (!results.length) return null;

  const getNumberClass = (number) => {
    if (number === 0 || number === '00') return 'number-green';
    const color = getNumberColor(number);
    return color === '#c61b1b' ? 'number-red' : 'number-black';
  };

  return (
    <div className="result-history">
      <h3>Previous Results</h3>
      <div className="history-numbers">
        {results.slice(0, maxResults).map((number, index) => {
          return (
            <div 
              key={index} 
              className={`history-number ${getNumberClass(number)} ${index === 0 ? 'latest-result' : ''}`}
            >
              {number}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultHistory;
