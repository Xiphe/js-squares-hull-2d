# js-squares-hull-2d

## Install

```bash
npm i js-squares-hull-2d
# yest add js-squares-hull-2d
```

## Usage

```ts
import getHull, { Matrix } from 'js-squares-hull-2d';

/* 0  1 2 x
   1 █▌
   2 █▌█▌
   y */
const matrix: Matrix<string> = [['█▌'], ['█▌', '█▌']];

/*
 _
|  `.
|___|
*/
const hull = getHull();

console.log(hull);
/* [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 1 },
  { x: 2, y: 2 },
  { x: 0, y: 2 }
] */
```

## Optimizations

### 1. diagonals are normalized

"Steps" are being treated as 45deg diagonals

```
         _
█▌   => |  `.
█▌█▌ => |___|
```

Meaning this hull will never be produced

```
         _
█▌   x> | |_
█▌█▌ x> |___|
```

### 2. Long borders sub-points are removed

```ts
import getHull from 'js-squares-hull-2d';

console.log(getHull([['█▌', '█▌', '█▌']]));
/* [
  { x: 0, y: 0 },
  { x: 3, y: 0 },
  { x: 3, y: 1 },
  { x: 0, y: 1 },
] */
```

Note the absence of points `{ x: 1, y: 0 }`, `{ x: 2, y: 0 }` etc..

### 3. Falsy values are ignored

```ts
import getHull from 'js-squares-hull-2d';

/* 0  1 2 x
   1   █▌
   2 █▌█▌
   y */
const matrix = [
  [null, '█▌'],
  ['█▌', '█▌'],
];

/*
   _
 .` |
|___|
*/
const hull = getHull(matrix);
console.log();
/* [
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 2, y: 2 },
  { x: 0, y: 2 },
  { x: 0, y: 1 }
] */
```

## License

> The MIT License
>
> Copyright (C) 2020 Hannes Diercks
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of
> this software and associated documentation files (the "Software"), to deal in
> the Software without restriction, including without limitation the rights to
> use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
> of the Software, and to permit persons to whom the Software is furnished to do
> so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
> FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
> COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
> IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
> CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
