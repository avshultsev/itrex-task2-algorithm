/* MY ASSUMPTIONS:
1. There's at least and only one possible exit from the maze.
2. The way is only one cell wide.
*/

const STEPS = {
  'top': ([pos, currRow]) => {
    const newRow = currRow - 1;
    return [pos, newRow]
  },
  'bottom': ([pos, currRow]) => {
    const newRow = currRow + 1;
    return [pos, newRow]
  },
  'left': ([pos, currRow]) => {
    const newPos = pos - 1;
    return [newPos, currRow]
  },
  'right': ([pos, currRow]) => {
    const newPos = pos + 1;
    return [newPos, currRow]
  },
};

const OPPOSITE = {
  'top'   : 'bottom',
  'bottom': 'top',
  'left'  : 'right',
  'right' : 'left'
};

const findInitPos = (maze = []) => {
  let pos = null;
  let currRow = null;
  for (const row of maze) {
    const idx = row.indexOf('0');
    if (idx !== -1) {
      pos = idx;
      currRow = maze.indexOf(row);
      break;
    }
  };
  return [pos, currRow];
};

const getPossibleSteps = ([pos, currRow], maze = []) => {
  const top     = (maze[currRow - 1][pos] === '+') && 'top';
  const bottom  = (maze[currRow + 1][pos] === '+') && 'bottom';
  const right   = (maze[currRow][pos + 1] === '+') && 'right';
  const left    = (maze[currRow][pos - 1] === '+') && 'left';
  return [top, bottom, left, right].filter(e => e);
};

const preventBackwards = (possibleSteps = [], prev = '') => {
  const opposite = OPPOSITE[prev];
  const index = possibleSteps.indexOf(opposite);
  if (index !== -1) possibleSteps.splice(index, 1);
  return possibleSteps;
};

const isExit = ([newPos, newRow], maze) => (newRow === 0 || newRow === maze.length - 1 || newPos === 0 || newPos === maze[newRow].length - 1);

// USAGE
// Answer for the maze given below: ['left', 'top','top','left','left','bottom','bottom','left']`
const maze = [
  ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
  ['#', '+', '+', '+', '#', '+', '+', '+', '#'],
  ['#', '+', '#', '+', '#', '+', '#', '+', '#'],
  ['+', '+', '#', '+', '0', '+', '#', '+', '#'],
  ['#', '#', '#', '+', '#', '#', '#', '#', '#'],
  ['#', '#', '+', '+', '#', '#', '#', '#', '#'],
  ['#', '#', '+', '#', '#', '#', '#', '#', '#'],
  ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
];

const tracePaths = (coords, maze, prev = '', way = []) => {
  const possibleSteps = getPossibleSteps(coords, maze);
  const steps = preventBackwards(possibleSteps, prev);
  for (const step of steps) {
    const changePosition = STEPS[step];
    const newCoords = changePosition(coords);
    way.push(step);
    if (isExit(newCoords, maze)) return way;
    const result = tracePaths(newCoords, maze, step, way);
    if (!result) {
      way.pop();
      continue;
    }
    return result;
  }
};

const initCoords = findInitPos(maze);
const possibleSteps = getPossibleSteps(initCoords, maze);
const instructions = tracePaths(initCoords, maze);
console.log({instructions});