import { Position } from '../typings';

let canvas = document.querySelector('canvas') as HTMLCanvasElement;

const bound = canvas.getBoundingClientRect();

const convertCoordinates = (x: number, y: number) => {
  canvas = canvas as HTMLCanvasElement;
  let midX = (canvas.width - bound.left) / 2;
  let midY = (canvas.height - bound.top) / 2;
  let outputX = (x - midX) / midX;
  let outputY = (midY - y) / midY;
  return [outputX, outputY];
};

const calculateNativePosition = (realPos: Position) => {
  const { x: realX, y: realY } = realPos;
  const midX = (canvas.width - bound.left) / 2;
  const midY = (canvas.height - bound.top) / 2;
  return {
    x: (realX - midX) / midX,
    y: (midY - realY) / midY,
  };
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

const generateSquareVertices = (
  startPoint: Position,
  pseudoSignedWidthVector: number,
  pseudoSignedHeightVector: number
) => {
  const vertices = new Array<number>();

  const xSign = Math.abs(pseudoSignedWidthVector) / pseudoSignedWidthVector;
  const ySign = Math.abs(pseudoSignedHeightVector) / pseudoSignedHeightVector;

  const dominantVectorLength = Math.max(
    Math.abs(pseudoSignedHeightVector),
    Math.abs(pseudoSignedWidthVector)
  );

  const topLeftPoint = convertCoordinates(startPoint.x, startPoint.y);
  const bottomLeftPoint = convertCoordinates(
    startPoint.x,
    startPoint.y + dominantVectorLength * ySign
  );
  const topRightPoint = convertCoordinates(
    startPoint.x + dominantVectorLength * xSign,
    startPoint.y
  );
  const bottomRightPoint = convertCoordinates(
    startPoint.x + dominantVectorLength * xSign,
    startPoint.y + dominantVectorLength * ySign
  );

  vertices.push(
    ...topLeftPoint,
    ...bottomLeftPoint,
    ...bottomRightPoint,

    ...bottomRightPoint,
    ...topRightPoint,
    ...topLeftPoint
  );

  return vertices;
};

const generateRectangleVertices = (topLeftPoint: Position, bottomRightPoint: Position) => {
  const vertices = new Array<number>();

  const firstTriangleA = convertCoordinates(topLeftPoint.x, topLeftPoint.y);
  const firstTriangleB = convertCoordinates(topLeftPoint.x, bottomRightPoint.y);
  const firstTriangleC = convertCoordinates(bottomRightPoint.x, bottomRightPoint.y);

  const secondTriangleA = convertCoordinates(bottomRightPoint.x, bottomRightPoint.y);
  const secondTriangleB = convertCoordinates(bottomRightPoint.x, topLeftPoint.y);
  const secondTriangleC = convertCoordinates(topLeftPoint.x, topLeftPoint.y);

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

  const lineFirstPoint = convertCoordinates(firstPoint.x, firstPoint.y);
  const lineSecondPoint = convertCoordinates(secondPoint.x, secondPoint.y);

  vertices.push(...lineFirstPoint, ...lineSecondPoint);

  return vertices;
};

const generatePolygonVertices = (poligonVertices: Array<Position>) => {
  const vertices = new Array<number>();

  var currentElement;
  for (let i = 0; i < poligonVertices.length; i++) {
    currentElement = convertCoordinates(poligonVertices[i].x, poligonVertices[i].y);
    vertices.push(...currentElement);
  }

  return vertices;
}

export {
  calculateNativePosition,
  calculateClientMousePosition,
  calculateRealMousePosition,
  generateSquareVertices,
  generateRectangleVertices,
  generateLineVertices,
  generatePolygonVertices
};
