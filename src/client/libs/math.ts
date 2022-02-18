import { Position } from '../typings';

let canvas = document.querySelector('canvas') as HTMLCanvasElement;

const bound = canvas.getBoundingClientRect();

const calculateNativePosition = (x: number, y: number) => {
  canvas = canvas as HTMLCanvasElement;
  let midX = (canvas.width - bound.left) / 2;
  let midY = (canvas.height - bound.top) / 2;
  let outputX = (x - midX) / midX;
  let outputY = (midY - y) / midY;
  return [outputX, outputY];
};

const calculateClientMousePosition = (e: MouseEvent) => {
  canvas = canvas as HTMLCanvasElement;
  const x = e.pageX - Math.floor(bound.left);
  const y = e.pageY - Math.floor(bound.top);
  return {
    x,
    y,
  };
};

const calculateRealMousePosition = (e: MouseEvent) => {
  canvas = canvas as HTMLCanvasElement;
  const x = e.pageX - bound.left;
  const y = e.pageY - bound.top;
  return {
    x,
    y,
  };
};

const generateSquareVertices = (topLeftPoint: Position, size: number) => {
  const vertices = new Array<number>();

  const firstTriangleA = calculateNativePosition(topLeftPoint.x, topLeftPoint.y);
  const firstTriangleB = calculateNativePosition(topLeftPoint.x, topLeftPoint.y + size);
  const firstTriangleC = calculateNativePosition(topLeftPoint.x + size, topLeftPoint.y + size);

  const secondTriangleA = calculateNativePosition(topLeftPoint.x, topLeftPoint.y);
  const secondTriangleB = calculateNativePosition(topLeftPoint.x + size, topLeftPoint.y);
  const secondTriangleC = calculateNativePosition(topLeftPoint.x + size, topLeftPoint.y + size);

  vertices.push(
    ...firstTriangleA,
    ...firstTriangleB,
    ...firstTriangleC,
    ...secondTriangleA,
    ...secondTriangleB,
    ...secondTriangleC
  );

  return new Float32Array(vertices);
};

const generateRectangleVertices = (topLeftPoint: Position, bottomRightPoint: Position) => {
  const vertices = new Array<number>();

  const firstTriangleA = calculateNativePosition(topLeftPoint.x, topLeftPoint.y);
  const firstTriangleB = calculateNativePosition(topLeftPoint.x, bottomRightPoint.y);
  const firstTriangleC = calculateNativePosition(bottomRightPoint.x, bottomRightPoint.y);

  const secondTriangleA = calculateNativePosition(bottomRightPoint.x, bottomRightPoint.y);
  const secondTriangleB = calculateNativePosition(bottomRightPoint.x, topLeftPoint.y);
  const secondTriangleC = calculateNativePosition(topLeftPoint.x, topLeftPoint.y);

  vertices.push(
    ...firstTriangleA,
    ...firstTriangleB,
    ...firstTriangleC,
    ...secondTriangleA,
    ...secondTriangleB,
    ...secondTriangleC
  );

  return vertices;
};

const generateLineVertices = (firstPoint: Position, secondPoint: Position) => {
  const vertices = new Array<number>();

  const lineFirstPoint = calculateNativePosition(firstPoint.x, firstPoint.y);
  const lineSecondPoint = calculateNativePosition(secondPoint.x, secondPoint.y);

  vertices.push(...lineFirstPoint, ...lineSecondPoint);

  return new Float32Array(vertices);
};

export {
  calculateNativePosition,
  calculateClientMousePosition,
  calculateRealMousePosition,
  generateSquareVertices,
  generateRectangleVertices,
  generateLineVertices,
};
