export type Vector = {
  x: number;
  y: number;
};

export function add(a: Vector, b: Vector): Vector {
  return {
    x: a.x + (b as Vector).x,
    y: a.y + (b as Vector).y,
  };
}

export function equals(a: Vector, b: Vector) {
  return a.x === b.x && a.y === b.y;
}
