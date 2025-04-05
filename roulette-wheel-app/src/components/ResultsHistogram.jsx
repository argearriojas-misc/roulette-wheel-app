import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResultsHistogram = ({ results, onClose }) => {
  const modalRef = useRef(null);

  // Calculate frequencies of each number
  const calculateFrequencies = () => {
    // Initialize counters for all possible roulette numbers (0-36)
    const frequencies = Array(37).fill(0);
    
    // Count occurrences of each number
    results.forEach(result => {
      if (result >= 0 && result <= 36) {
        frequencies[result]++;
      }
    });
    
    return frequencies;
  };

  const frequencies = calculateFrequencies();
  
  // Chart data
  const chartData = {
    labels: Array.from({ length: 37 }, (_, i) => i.toString()),
    datasets: [
      {
        label: 'Frequency',
        data: frequencies,
        backgroundColor: Array.from({ length: 37 }, (_, i) => {
          // Use roulette colors: green for 0, red for certain numbers, black for others
          if (i === 0) return 'rgba(0, 128, 0, 0.7)'; // Green for 0
          
          // Red numbers in European roulette: 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
          const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
          return redNumbers.includes(i) 
            ? 'rgba(220, 53, 69, 0.7)' // Red
            : 'rgba(52, 58, 64, 0.7)'; // Black
        }),
        borderColor: Array.from({ length: 37 }, (_, i) => {
          if (i === 0) return 'rgba(0, 128, 0, 1)';
          const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
          return redNumbers.includes(i) 
            ? 'rgba(220, 53, 69, 1)'
            : 'rgba(52, 58, 64, 1)';
        }),
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff'
        }
      },
      title: {
        display: true,
        text: 'Roulette Numbers Frequency',
        color: '#ffffff',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            const percentage = (value / results.length * 100).toFixed(1);
            return `Frequency: ${value} (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Roulette Number',
          color: '#ffffff'
        },
        ticks: {
          color: '#ffffff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Frequency',
          color: '#ffffff'
        },
        ticks: {
          precision: 0,
          color: '#ffffff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    color: '#ffffff',
    backgroundColor: '#333333'
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Calculate stats
  const totalSpins = results.length;
  const mostFrequent = frequencies.indexOf(Math.max(...frequencies));
  const maxFrequency = Math.max(...frequencies);
  const maxPercentage = (maxFrequency / totalSpins * 100).toFixed(1);

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal-content">
        <div className="modal-header">
          <h2>Results Analysis</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        <div className="modal-body">
          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-label">Total Spins:</span>
              <span className="stat-value">{totalSpins}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Most Frequent Number:</span>
              <span className="stat-value">{mostFrequent} ({maxFrequency} times, {maxPercentage}%)</span>
            </div>
          </div>
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsHistogram;
