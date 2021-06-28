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

const isExit = (newPos, newRow, maze) => (newRow === 0 || newRow === maze.length - 1 || newPos === 0 || newPos === newRow.length - 1);

const tracePaths = (coords, possibleSteps, maze, way = '') => {
  for (const step of possibleSteps) {
    const changePosition = STEPS[step];
    way += step + ' ';
    const [newPos, newRow] = changePosition(coords);
    if (isExit(newPos, newRow, maze)) return way.trim().split(' ');
    const possSteps = getPossibleSteps([newPos, newRow], maze);
    const opposite = OPPOSITE[step];          // we are moving only forward in one direction
    const idx = possSteps.indexOf(opposite);
    if (idx !== -1) possSteps.splice(idx, 1); // so we dispose of previous steps not to go backwards
    if (possSteps.length === 0) continue;     // deadend reached
    return fn([newPos, newRow], possSteps, maze, way);
  }
};

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

const initCoords = findInitPos(maze);
const possibleSteps = getPossibleSteps(initCoords, maze);
const instructions = tracePaths(initCoords, possibleSteps, maze);
console.log(instructions);