import React, { useState, useEffect, useRef } from 'react';
import { wheelNumbers, getNumberColor } from '../utils/wheelData';
import { updatePhysics, initializeWheelState, startSpinning } from '../utils/physics';
import { determineWinningNumber } from '../utils/physics';

const RouletteWheel = ({ config, onResult }) => {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  // const [wheelRotation, setWheelRotation] = useState(0);
  const animationRef = useRef(null);
  const wheelState = useRef(initializeWheelState());

  // Draw the roulette wheel
  const drawWheel = (ctx, centerX, centerY, radius) => {
    const { appearance } = config;
    const totalNumbers = wheelNumbers.length;
    const anglePerNumber = (2 * Math.PI) / totalNumbers;
    
    // Draw the outer ring
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(wheelState.current.rotation);
    
    // Draw outer circle
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#321e10'; // Dark wood color
    ctx.fill();
    ctx.strokeStyle = '#c0a080';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw number pockets
    wheelNumbers.forEach((number, i) => {
      const angle = i * anglePerNumber;
      
      // Draw pocket
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius - 10, angle, angle + anglePerNumber);
      ctx.closePath();
      ctx.fillStyle = getNumberColor(number);
      ctx.fill();
      ctx.strokeStyle = '#c0a080';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw number text
      if (appearance.showNumbers) {
        ctx.save();
        // Position at the middle of the segment
        const textAngle = angle + anglePerNumber / 2;
        // Move to the correct position in the pocket
        const textRadius = radius - 30;
        const textX = Math.cos(textAngle) * textRadius;
        const textY = Math.sin(textAngle) * textRadius;
        
        ctx.translate(textX, textY);
        // Rotate text to be readable from outside the wheel
        ctx.rotate(textAngle + Math.PI / 2);
        
        ctx.fillStyle = '#ffffff';
        // Use font size and font family from config
        const fontSize = config.appearance.numberFontSize || 12;
        const fontFamily = config.appearance.numberFont || 'Arial';
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(number.toString(), 0, 0);
        ctx.restore();
      }
    });
    
    // Draw center
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#321e10';
    ctx.fill();
    ctx.strokeStyle = '#c0a080';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
  };

  // Draw the ball
  const drawBall = (ctx, centerX, centerY, radius) => {
    const state = wheelState.current;
    if (state.spinPhase === 'stopped' && !state.landedNumber) return;
    
    // Calculate the ball position based on its angle
    const ballX = centerX + Math.cos(state.ballAngle) * state.ballDistance;
    const ballY = centerY + Math.sin(state.ballAngle) * state.ballDistance;
    
    // Draw the ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, config.appearance.ballSize, 0, 2 * Math.PI);
    ctx.fillStyle = '#e0e0e0';
    ctx.fill();
    ctx.strokeStyle = '#a0a0a0';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // For debugging: Draw a line from center to ball to verify angle
    if (config.appearance.showDebugInfo) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(ballX, ballY);
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Show the current number segment
      const currentNumber = determineWinningNumber(state.ballAngle, state.rotation);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '10px Arial';
      ctx.fillText(`Ball: ${currentNumber}`, ballX + 10, ballY + 10);
    }
  };

  // Animation loop for wheel and ball
  const animate = (timestamp) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = config.appearance.wheelDiameter / 2;
    const state = wheelState.current;
    const { physics } = config;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update physics
    if (state.spinPhase !== 'stopped') {
      // Update wheel rotation
      state.rotation += state.angularVelocity;
      // setWheelRotation(state.rotation);
      
      // Update ball position
      state.ballAngle += state.ballVelocity;
      
      // Apply physics based on phase
      if (state.spinPhase === 'accelerating') {
        state.angularVelocity = Math.min(physics.wheelSpeed, state.angularVelocity + 0.002);
        state.ballVelocity = Math.min(physics.ballSpeed, state.ballVelocity + 0.01);
        state.ballDistance = Math.min(radius - 20, state.ballDistance + 0.5);
        
        if (timestamp - state.spinStartTime > 1000) {
          state.spinPhase = 'spinning';
        }
      } else if (state.spinPhase === 'spinning') {
        if (timestamp - state.spinStartTime > physics.spinTime) {
          state.spinPhase = 'decelerating';
        }
      } else if (state.spinPhase === 'decelerating') {
        // Slow down the wheel and ball
        state.angularVelocity *= physics.friction;
        state.ballVelocity *= physics.friction;
        
        // Ball moves inward as it slows
        if (state.ballDistance > 70) {
          state.ballDistance -= 0.3;
        }
        
        // Ball bounces in pockets as it slows down
        if (state.ballVelocity < 0.1) {
          state.ballVelocity += (Math.sin(state.ballAngle * 10) * 0.01) * physics.bounceFactor;
        }
        
        // Stop when very slow
        if (Math.abs(state.angularVelocity) < 0.001 && Math.abs(state.ballVelocity) < 0.001) {
          state.spinPhase = 'stopped';
          // Use updated winning number determination that accounts for wheel rotation
          state.landedNumber = determineWinningNumber(state.ballAngle, state.rotation);
          onResult(state.landedNumber);
          setIsSpinning(false);
          
          // Auto-spin if configured
          if (config.ui.autoSpin) {
            setTimeout(spinWheel, config.timing.waitBetweenSpins);
          }
        }
      }
    }
    
    // Draw wheel and ball
    drawWheel(ctx, centerX, centerY, radius);
    drawBall(ctx, centerX, centerY, radius);
    
    // Continue animation
    animationRef.current = requestAnimationFrame(animate);
  };

  // Initialize the canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = config.appearance.wheelDiameter / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWheel(ctx, centerX, centerY, radius);
    
    // Start animation loop
    animationRef.current = requestAnimationFrame(animate);
    
    // Auto-spin on start if configured
    if (config.ui.autoSpin) {
      setTimeout(spinWheel, 1000);
    }
    
    // Clean up
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config]); // Re-initialize when config changes

  // Start spinning the wheel
  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    if (onResult) onResult(null); // Clear previous result
    
    wheelState.current = startSpinning(wheelState.current);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
      <canvas
        ref={canvasRef}
        width={config.appearance.wheelDiameter + 40}
        height={config.appearance.wheelDiameter + 40}
        className="mb-4 bg-gray-200 rounded-full"
      />
      
      {config.ui.showRunButton && (
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSpinning ? 'Spinning...' : 'Spin Wheel'}
        </button>
      )}
    </div>
  );
};

export default RouletteWheel;