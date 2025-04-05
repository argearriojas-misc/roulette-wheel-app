import React from 'react';
import { getNumberColor } from '../utils/wheelData';

const ResultDisplay = ({ result, show }) => {
  if (!show || result === null) return null;

  return (
    <div className="mb-4 text-2xl font-bold" style={{ color: getNumberColor(result) }}>
      Result: {result}
    </div>
  );
};

export default ResultDisplay;