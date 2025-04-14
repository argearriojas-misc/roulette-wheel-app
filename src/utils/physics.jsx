import { wheelNumbers } from './wheelData';

/**
 * Initialize wheel state for spinning
 * @returns {Object} Initial wheel state
 */
export const initializeWheelState = () => ({
  rotation: 0,
  angularVelocity: 0,
  ballAngle: 0,
  ballDistance: 0,
  ballVelocity: 0,
  spinPhase: 'stopped', // 'accelerating', 'spinning', 'decelerating', 'stopped'
  spinStartTime: 0,
  landedNumber: null
});

/**
 * Start wheel spinning with randomized initial conditions
 * @param {Object} state - Wheel state object
 * @returns {Object} Updated state ready for spinning
 */
export const startSpinning = (state) => {
  state.spinPhase = 'accelerating';
  state.spinStartTime = performance.now();
  state.angularVelocity = 0.01;
  state.ballVelocity = 0.01;
  state.ballDistance = 40;
  state.landedNumber = null;
  
  // Randomize initial angles slightly
  state.ballAngle = Math.random() * Math.PI * 2;
  
  return state;
};

/**
 * Determine the winning number based on ball position
 * @param {number} ballAngle - Current ball angle
 * @returns {number|string} The winning number
 */
export const determineWinningNumber = (ballAngle, wheelRotation) => {
  const totalNumbers = wheelNumbers.length;
  const anglePerNumber = (2 * Math.PI) / totalNumbers;
  
  // Calculate the effective angle considering both the ball position and wheel rotation
  // The wheel rotation is subtracted because the wheel rotates in the opposite direction of the ball
  let effectiveAngle = (ballAngle - wheelRotation) % (2 * Math.PI);
  
  // Normalize the angle to positive value in [0, 2π]
  if (effectiveAngle < 0) effectiveAngle += (2 * Math.PI);
  
  // Calculate the index in the wheel array
  const index = Math.floor(effectiveAngle / anglePerNumber);

  // Get the number at this position
  return wheelNumbers[index];
};