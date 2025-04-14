import { wheelNumbers } from './wheelData';

/**
 * Update wheel physics state based on current phase
 * @param {Object} state - Current wheel state
 * @param {Object} config - Physics configuration
 * @param {number} timestamp - Current animation timestamp
 * @param {number} radius - Wheel radius
 * @returns {Object} Updated state
 */
export const updatePhysics = (state, config, timestamp, radius) => {
  const { physics } = config;
  
  switch (state.spinPhase) {
    case 'accelerating':
      // Accelerate wheel and ball
      state.angularVelocity = Math.min(physics.wheelSpeed, state.angularVelocity + 0.002);
      state.ballVelocity = Math.min(physics.ballSpeed, state.ballVelocity + 0.01);
      state.ballDistance = Math.min(radius - 20, state.ballDistance + 0.5);
      
      // Transition to spinning phase after 1 second
      if (timestamp - state.spinStartTime > 1000) {
        state.spinPhase = 'spinning';
      }
      break;
      
    case 'spinning':
      // Maintain speed for spinTime duration
      if (timestamp - state.spinStartTime > physics.spinTime) {
        state.spinPhase = 'decelerating';
      }
      break;
      
    case 'decelerating':
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
        state.landedNumber = determineWinningNumber(state.ballAngle);
      }
      break;
  }
  
  // Update wheel rotation and ball position
  state.rotation += state.angularVelocity;
  state.ballAngle += state.ballVelocity;
  
  return state;
};

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