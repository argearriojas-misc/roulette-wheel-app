// American roulette wheel numbers in order
export const wheelNumbers = [
  0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, 
  '00', 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2
];

// Map numbers to colors (0 and 00 are green, others alternate red/black)
export const getNumberColor = (number) => {
  if (number === 0 || number === '00') return '#00a300'; // Green
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  return redNumbers.includes(Number(number)) ? '#c61b1b' : '#000000'; // Red or Black
};