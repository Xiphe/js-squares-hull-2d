import getHull, { getFirstPos, Matrix } from './getHull';

function createMatrix(input: string) {
  const matrix: Matrix<true> = [];
  let rowI = -1;
  input.split('\n').forEach((fullRow) => {
    const row = fullRow.trim();
    if (rowI === -1 && (row[0] === '0' || row[0] === 'y' || !row.length)) {
      return;
    }
    rowI += 1;

    const len = row.substr(2).length / 2;

    for (let i = 0; i < len; i++) {
      const token = row.substr(2 + i * 2, 2);
      if (token.trim().length) {
        if (!matrix[rowI]) {
          matrix[rowI] = [];
        }
        matrix[rowI][i] = true;
      }
    }
  });
  return matrix;
}

describe('getFirstPos', () => {
  it('ignores falsy elements', () => {
    expect(getFirstPos([[undefined]])).toEqual(undefined);
  });

  it('gets fist element in Matrix', () => {
    expect(getFirstPos([[1]])).toEqual({ x: 0, y: 0 });
  });

  it('gets first element after falsy elements', () => {
    expect(getFirstPos([[undefined], [null, false, 1]])).toEqual({
      x: 2,
      y: 1,
    });
  });

  it('returns undefined when no columns given', () => {
    expect(getFirstPos([])).toBe(undefined);
  });

  it('returns undefined when no elements in column', () => {
    expect(getFirstPos([[], []])).toBe(undefined);
  });

  it('gets element from first row', () => {
    const col1 = [];
    col1[20] = 1;
    expect(getFirstPos([col1, [1]])).toEqual({ y: 0, x: 20 });
  });

  it('gets element from second row', () => {
    const col2 = [];
    col2[20] = 1;
    expect(getFirstPos([[], col2])).toEqual({ y: 1, x: 20 });
  });
});

describe('getHull', () => {
  it('ignores falsy values', () => {
    expect(getHull([[undefined, null, false, 0]])).toBe(undefined);
  });

  it('returns outer points of single element', () => {
    expect(
      getHull(
        createMatrix(`
          0  1 x
          1 █▌
          y
        `),
      ),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ]);
  });

  it('returns outer points of two x-aligned elements', () => {
    expect(
      getHull(
        createMatrix(`
          0  1 2 x
          1 █▌█▌
          y
        `),
      ),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 0, y: 1 },
    ]);
  });

  it('returns outer points of two y-aligned elements', () => {
    expect(
      getHull(
        createMatrix(`
          0  1 x
          1 █▌
          2 █▌
          y
        `),
      ),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 2 },
      { x: 0, y: 2 },
    ]);
  });

  it('returns outer points of two diagonally-aligned elements', () => {
    expect(
      getHull(
        createMatrix(`
          0  1 2 x
          1 █▌
          2   █▌
          y
        `),
      ),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 1 },
    ]);
  });

  it('returns outer points of two opposite diagonally-aligned elements', () => {
    expect(
      getHull(
        createMatrix(`
          0 0 1 2 x
          1   █▌
          2 █▌
          y
        `),
      ),
    ).toEqual([
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 1 },
    ]);
  });

  it('returns outer points of box', () => {
    expect(
      getHull(
        createMatrix(`
          0  1 2 x
          1 █▌█▌
          2 █▌█▌
          y
        `),
      ),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
    ]);
  });

  it('skips middle points horizontally', () => {
    expect(
      getHull(
        createMatrix(`
          0  1 2 3 x
          1 █▌█▌█▌
          y
        `),
      ),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 0, y: 1 },
    ]);
  });

  it('skips multiple middle points horizontally', () => {
    expect(
      getHull(
        createMatrix(`
          0  1 2 3 4 x
          1 █▌█▌█▌█▌
          y
        `),
      ),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 1 },
      { x: 0, y: 1 },
    ]);
  });

  it('skips middle points vertically', () => {
    expect(
      getHull(
        createMatrix(`
          0  1 x
          1 █▌
          2 █▌
          3 █▌
          y
        `),
      ),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 3 },
      { x: 0, y: 3 },
    ]);
  });

  it('creates j 90deg', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 x
        1 █▌
        2   █▌█▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 1 },
    ]);
  });

  it('creates j 180deg', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 x
        1   █▌
        2 █▌
        3 █▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 0, y: 3 },
      { x: 0, y: 1 },
    ]);
  });

  it('creates l', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 x
        1 █▌
        2 █▌
        3   █▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 0, y: 2 },
    ]);
  });

  it('creates snake running up a hill', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 x
        1     █▌
        2 █▌█▌
        3 █▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 1, y: 3 },
      { x: 0, y: 3 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]);
  });

  it('creates J with corners', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 x
        1     █▌
        2 █▌  █▌
        3 █▌█▌█▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 3 },
      { x: 0, y: 3 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ]);
  });

  it('creates U', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 x
        1 █▌  █▌
        2 █▌  █▌
        3 █▌█▌█▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 3 },
      { x: 0, y: 3 },
    ]);
  });

  it('creates U 90deg', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 x
        1 █▌█▌█▌
        2 █▌
        3 █▌█▌█▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },

      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 0, y: 3 },
    ]);
  });

  it('creates U 180deg', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 x
        1 █▌█▌█▌
        2 █▌  █▌
        3 █▌  █▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 3 },
      { x: 2, y: 3 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 3 },
      { x: 0, y: 3 },
    ]);
  });

  it('creates U 270deg', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 x
        1 █▌█▌█▌
        2     █▌
        3 █▌█▌█▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 3 },
      { x: 0, y: 3 },
      { x: 0, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 1 },
      { x: 0, y: 1 },
    ]);
  });

  it('creates boomerang', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 x
        1 █▌█▌█▌
        2 █▌
        3 █▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 0, y: 3 },
    ]);
  });

  it('creates pipe', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 4 x
        1 █▌  █▌█▌
        2   █▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 1 },
      { x: 3, y: 1 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 1 },
    ]);
  });

  it('creates bumps', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 4 x
        1 █▌  █▌
        2 █▌█▌█▌█▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 1 },
      { x: 4, y: 2 },
      { x: 0, y: 2 },
    ]);
  });

  it('creates bowl', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 4 x
        1 █▌    █▌
        2 █▌█▌█▌█▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 1 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 2 },
      { x: 0, y: 2 },
    ]);
  });

  it('creates steps up', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 x
        1     █▌
        2   █▌█▌
        3 █▌█▌█▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 3 },
      { x: 0, y: 3 },
      { x: 0, y: 2 },
    ]);
  });

  it('creates hull of triangle', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 x
        1 █▌█▌█▌
        2   █▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 1 },
    ]);
  });

  it('creates hull of steps', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 x
        1   █▌
        2 █▌  █▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 1 },
    ]);
  });

  it('creates hull of steps 90deg', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 x
        1 █▌
        2   █▌
        3 █▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 1, y: 3 },
      { x: 0, y: 3 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ]);
  });

  it('creates hull of steps 180deg', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3x
        1 █▌  █▌
        2   █▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 1 },
    ]);
  });

  it('creates hull of steps 270deg', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 x
        1   █▌
        2 █▌
        3   █▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 0, y: 2 },
      { x: 0, y: 1 },
    ]);
  });

  it('creates hull of open O', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 x
        1 █▌█▌
        2     █▌
        3 █▌  █▌
        4   █▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 1 },
      { x: 3, y: 3 },
      { x: 2, y: 4 },
      { x: 1, y: 4 },
      { x: 0, y: 3 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 2, y: 2 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ]);
  });

  it('creates hull of open O 90deg', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 x
        1   █▌
        2 █▌  █▌
        3 █▌
        4   █▌█▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 1, y: 4 },
      { x: 0, y: 3 },
      { x: 0, y: 1 },
    ]);
  });

  it('creates hull of open O 270deg', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 4 x
        1   █▌█▌
        2 █▌    █▌
        3 █▌  █▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 1, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 1 },
      { x: 4, y: 2 },
      { x: 3, y: 3 },
      { x: 2, y: 3 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 0, y: 3 },
      { x: 0, y: 1 },
    ]);
  });

  it('creates hull of spiral', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 4 x
        1   █▌█▌
        2       █▌
        3   █▌  █▌
        4 █▌    █▌
        5   █▌█▌
        y
      `),
    );
    const expectedHull = [
      { x: 1, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 1 },
      { x: 4, y: 4 },
      { x: 3, y: 5 },
      { x: 1, y: 5 },
      { x: 0, y: 4 },
      { x: 0, y: 3 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 3, y: 3 },
      { x: 3, y: 2 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
    ];
    expectedHull.forEach((point, i) => {
      expect({ point: hull![i], i }).toEqual({ point, i });
    });

    expect(hull).toEqual(expectedHull);
  });

  it('creates y 225deg', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 x
        1     █▌
        2 █▌█▌
        3   █▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 0, y: 2 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]);
  });

  it('creates J', () => {
    const hull = getHull(
      createMatrix(`
        0  1 2 3 x
        1     █▌
        2 █▌  █▌
        3   █▌
        y
      `),
    );
    expect(hull).toEqual([
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 2 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 0, y: 2 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ]);
  });
});
