import { Vector, add, equals } from './Vector';

export type Matrix<T> = T[][];

const ANGLES = ['↖', '↑', '↗', '→', '↘', '↓', '↙', '←'];
const LOOKUP: Vector[] = [
  { x: -1, y: -1 }, // 0 ↖
  { x: 0, y: -1 }, // 1 ↑
  { x: 1, y: -1 }, // 2 ↗
  { x: 1, y: 0 }, // 3 →
  { x: 1, y: 1 }, // 4 ↘
  { x: 0, y: 1 }, // 5 ↓
  { x: -1, y: 1 }, // 6 ↙
  { x: -1, y: 0 }, // 7 ←
];
const TOP_RIGHT = { x: 1, y: 0 };
const BOTTOM_RIGHT = { x: 1, y: 1 };
const BOTTOM_LEFT = { x: 0, y: 1 };

function normalizeAngle(angle: number) {
  while (angle >= 8 || angle < 0) {
    if (angle >= 8) {
      angle -= 8;
    } else {
      angle += 8;
    }
  }
  return angle;
}

export function getFirstPos<T>(matrix: Matrix<T>): Vector | undefined {
  let p: undefined | Vector = undefined;

  for (const y in matrix) {
    const row = matrix[y];
    if (!row.length) {
      continue;
    }

    for (const x in row) {
      if (row[x]) {
        p = {
          x: parseInt(x, 10),
          y: parseInt(y, 10),
        };
        break;
      }
    }
    if (p) {
      break;
    }
  }

  return p;
}

function getNext(
  matrix: Matrix<any>,
  current: Vector,
  angle: number,
): [Vector, number] {
  for (let i = 0; i < 8; i++) {
    const nextAngle = normalizeAngle(i + angle);
    const nextPos = add(current, LOOKUP[nextAngle]);

    if (matrix[nextPos.y] && matrix[nextPos.y][nextPos.x]) {
      return [nextPos, nextAngle];
    }
  }
  throw new Error('Could not find next point');
}

export default function getHull(matrix: Matrix<any>): Vector[] | undefined {
  const initPos = getFirstPos(matrix);

  if (!initPos) {
    return;
  }

  const points = [initPos];
  function pushPoint(point: Vector) {
    points.push(point);
  }
  let prevAngle = 3;

  try {
    var [currentPos, currentAngle] = getNext(matrix, initPos, prevAngle);
  } catch {
    return [
      ...points,
      add(initPos, TOP_RIGHT),
      add(initPos, BOTTOM_RIGHT),
      add(initPos, BOTTOM_LEFT),
    ];
  }

  const initContacts = [currentPos];

  if (currentAngle > 3) {
    points.push(add(initPos, TOP_RIGHT));
  }
  if (currentAngle === 6) {
    points.push(add(initPos, BOTTOM_RIGHT));
  }

  function findInitContact() {
    const [nextPos] = getNext(
      matrix,
      currentPos,
      normalizeAngle(currentAngle - 3),
    );

    if (initContacts.find(({ x, y }) => nextPos.x === x && nextPos.y === y)) {
      return false;
    }

    initContacts.push(nextPos);
    return true;
  }

  // const INSPECT = -1;
  while (currentPos && (!equals(currentPos, initPos) || findInitContact())) {
    const [nextPos, nextAngle] = getNext(matrix, currentPos, currentAngle - 3);

    if (currentAngle !== nextAngle) {
      // if (points.length === INSPECT) {
      // console.log({ currentAngle, nextAngle, points, currentPos });
      // }
      switch (currentAngle) {
        case 0:
          switch (nextAngle) {
            case 1:
              pushPoint(add(currentPos, BOTTOM_LEFT));
              break;
            case 2:
              pushPoint(add(currentPos, BOTTOM_LEFT));
              pushPoint(currentPos);
              break;
            case 3:
              pushPoint(add(currentPos, BOTTOM_LEFT));
              pushPoint(currentPos);
              break;
            case 4:
              pushPoint(add(currentPos, BOTTOM_LEFT));
              pushPoint(currentPos);
              pushPoint(add(currentPos, TOP_RIGHT));
              break;
            // case 5:
            /* I think this is not possible */
            case 6:
              pushPoint(add(currentPos, BOTTOM_RIGHT));
              pushPoint(add(currentPos, BOTTOM_LEFT));
              break;
            case 7:
              if (prevAngle !== 2) {
                pushPoint(add(currentPos, BOTTOM_LEFT));
              }
              break;
            default:
              console.log({
                currentAngle: ANGLES[currentAngle],
                nextAngle: ANGLES[nextAngle],
                points,
                currentPos,
              });
              throw new Error(`Implement ${currentAngle}:${nextAngle}`);
          }
          break;
        case 1:
          switch (nextAngle) {
            case 0:
              if (getNext(matrix, nextPos, nextAngle - 3)[1] !== 6) {
                pushPoint(add(currentPos, BOTTOM_LEFT));
              }
              break;
            case 2:
              pushPoint(currentPos);
              break;
            case 3:
              pushPoint(currentPos);
              break;
            case 4:
              pushPoint(currentPos);
              pushPoint(add(currentPos, TOP_RIGHT));
              break;
            case 5:
              pushPoint(currentPos);
              pushPoint(add(currentPos, TOP_RIGHT));
              break;
            // case 6:
            /* I think this is not possible */
            // case 7:
            /* I think this is not possible */
            default:
              console.log({
                currentAngle: ANGLES[currentAngle],
                nextAngle: ANGLES[nextAngle],
                points,
                currentPos,
              });
              throw new Error(`Implement ${currentAngle}:${nextAngle}`);
          }
          break;
        case 2:
          switch (nextAngle) {
            case 0:
              pushPoint(add(currentPos, BOTTOM_LEFT));
              pushPoint(currentPos);
              break;
            case 1:
              if (prevAngle !== 4) {
                pushPoint(currentPos);
              }
              break;
            case 3:
              pushPoint(currentPos);
              break;
            case 4:
              pushPoint(currentPos);
              pushPoint(add(currentPos, TOP_RIGHT));
              break;
            case 5:
              pushPoint(currentPos);
              pushPoint(add(currentPos, TOP_RIGHT));
              break;
            case 6:
              pushPoint(currentPos);
              pushPoint(add(currentPos, TOP_RIGHT));
              pushPoint(add(currentPos, BOTTOM_RIGHT));
              break;
            // case 7:
            /* I think this is not possible */
            default:
              console.log({
                currentAngle: ANGLES[currentAngle],
                nextAngle: ANGLES[nextAngle],
                points,
                currentPos,
              });
              throw new Error(`Implement ${currentAngle}:${nextAngle}`);
          }
          break;
        case 3:
          switch (nextAngle) {
            // case 1:
            /* I think this is not possible */
            case 2:
              if (
                prevAngle !== 4 &&
                getNext(matrix, nextPos, nextAngle - 3)[1] !== 0
              ) {
                pushPoint(currentPos);
              }
              break;
            case 4:
              pushPoint(add(currentPos, TOP_RIGHT));
              break;
            case 5:
              pushPoint(add(currentPos, TOP_RIGHT));
              break;
            case 6:
              pushPoint(add(currentPos, TOP_RIGHT));
              pushPoint(add(currentPos, BOTTOM_RIGHT));
              break;
            case 7:
              pushPoint(add(currentPos, TOP_RIGHT));
              pushPoint(add(currentPos, BOTTOM_RIGHT));
              break;
            default:
              console.log({
                currentAngle: ANGLES[currentAngle],
                nextAngle: ANGLES[nextAngle],
                points,
                currentPos,
              });
              throw new Error(`Implement ${currentAngle}:${nextAngle}`);
          }
          break;
        case 4:
          switch (nextAngle) {
            case 0:
              pushPoint(add(currentPos, TOP_RIGHT));
              pushPoint(add(currentPos, BOTTOM_RIGHT));
              pushPoint(add(currentPos, BOTTOM_LEFT));
              break;
            // case 1:
            /* I think this is not possible */
            case 2:
              pushPoint(currentPos);
              pushPoint(add(currentPos, TOP_RIGHT));
              break;
            case 3:
              if (
                prevAngle !== 6 ||
                getNext(matrix, nextPos, nextAngle - 3)[1] === 2
              ) {
                pushPoint(add(currentPos, TOP_RIGHT));
              }
              break;
            case 5:
              pushPoint(add(currentPos, TOP_RIGHT));
              break;
            case 6:
              pushPoint(add(currentPos, TOP_RIGHT));
              pushPoint(add(currentPos, BOTTOM_RIGHT));
              break;
            case 7:
              pushPoint(add(currentPos, TOP_RIGHT));
              pushPoint(add(currentPos, BOTTOM_RIGHT));
              break;
            default:
              console.log({
                currentAngle: ANGLES[currentAngle],
                nextAngle: ANGLES[nextAngle],
                points,
                currentPos,
              });
              throw new Error(`Implement ${currentAngle}:${nextAngle}`);
          }
          break;
        case 5:
          switch (nextAngle) {
            case 0:
              pushPoint(add(currentPos, BOTTOM_RIGHT));
              pushPoint(add(currentPos, BOTTOM_LEFT));
              break;
            case 1:
              pushPoint(add(currentPos, BOTTOM_RIGHT));
              pushPoint(add(currentPos, BOTTOM_LEFT));
              break;
            // case 2:
            /* I think this is not possible */
            // case 3:
            /* I think this is not possible */
            case 4:
              if (getNext(matrix, nextPos, nextAngle - 3)[1] !== 2) {
                pushPoint(add(currentPos, TOP_RIGHT));
              }
              break;
            case 6:
              pushPoint(add(currentPos, BOTTOM_RIGHT));
              break;
            case 7:
              pushPoint(add(currentPos, BOTTOM_RIGHT));
              break;
            default:
              console.log({
                currentAngle: ANGLES[currentAngle],
                nextAngle: ANGLES[nextAngle],
                points,
                currentPos,
              });
              throw new Error(`Implement ${currentAngle}:${nextAngle}`);
          }
          break;
        case 6:
          switch (nextAngle) {
            case 0:
              pushPoint(add(currentPos, BOTTOM_RIGHT));
              pushPoint(add(currentPos, BOTTOM_LEFT));
              break;
            case 1:
              pushPoint(add(currentPos, BOTTOM_RIGHT));
              pushPoint(add(currentPos, BOTTOM_LEFT));
              break;
            case 2:
              pushPoint(add(currentPos, BOTTOM_RIGHT));
              pushPoint(add(currentPos, BOTTOM_LEFT));
              pushPoint(currentPos);
              break;
            // case 3:
            /* I think this is not possible */
            case 4:
              pushPoint(add(currentPos, TOP_RIGHT));
              pushPoint(add(currentPos, BOTTOM_RIGHT));
              break;
            case 5:
              if (prevAngle !== 0) {
                pushPoint(add(currentPos, BOTTOM_RIGHT));
              }
              break;
            case 7:
              pushPoint(add(currentPos, BOTTOM_RIGHT));
              break;
            default:
              console.log({
                currentAngle: ANGLES[currentAngle],
                nextAngle: ANGLES[nextAngle],
                points,
                currentPos,
              });
              throw new Error(`Implement ${currentAngle}:${nextAngle}`);
          }
          break;
        case 7:
          switch (nextAngle) {
            case 0:
              pushPoint(add(currentPos, BOTTOM_LEFT));
              break;
            case 1:
              pushPoint(add(currentPos, BOTTOM_LEFT));
              break;
            case 2:
              pushPoint(add(currentPos, BOTTOM_LEFT));
              pushPoint(currentPos);
              break;
            case 3:
              pushPoint(add(currentPos, BOTTOM_LEFT));
              pushPoint(currentPos);
              break;
            // case 4:
            /* I think this is not possible */
            // case 5:
            /* I think this is not possible */
            case 6:
              if (getNext(matrix, nextPos, nextAngle - 3)[1] !== 4) {
                pushPoint(add(currentPos, BOTTOM_RIGHT));
              }
              break;
            default:
              console.log({
                currentAngle: ANGLES[currentAngle],
                nextAngle: ANGLES[nextAngle],
                points,
                currentPos,
              });
              throw new Error(`Implement ${currentAngle}:${nextAngle}`);
          }
          break;
      }

      prevAngle = currentAngle;
    }

    currentPos = nextPos;
    currentAngle = nextAngle;
  }

  if (!currentPos) {
    throw new Error('This should never happen');
  }

  switch (currentAngle) {
    case 1:
    case 2:
      break;
    case 0:
    case 7:
      points.push(add(currentPos, BOTTOM_LEFT));
      break;
    default:
      console.log({ points, currentAngle, currentPos });
      throw new Error(`Unexpected final angle ${currentAngle}`);
  }

  return points;
}
