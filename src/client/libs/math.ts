import { Position, Vec2 } from '../typings';

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

  vertices.push(...topLeftPoint, ...topRightPoint, ...bottomRightPoint, ...bottomLeftPoint);

  return vertices;
};

const generateRectangleVertices = (topLeftPoint: Position, bottomRightPoint: Position) => {
  const vertices = new Array<number>();

  const verticeA = convertCoordinates(topLeftPoint.x, topLeftPoint.y);
  const verticeB = convertCoordinates(bottomRightPoint.x, topLeftPoint.y);
  const verticeC = convertCoordinates(bottomRightPoint.x, bottomRightPoint.y);
  const verticeD = convertCoordinates(topLeftPoint.x, bottomRightPoint.y);

  vertices.push(...verticeA, ...verticeB, ...verticeC, ...verticeD);

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
};

const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
  const xDiff = x1 - x2;
  const yDiff = y1 - y2;

  return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
};

const yCoordinateinLine = (x: number, vertices: Array<Position>) => {
  const x1 = vertices[0].x;
  const x2 = vertices[1].x;
  const y1 = vertices[0].y;
  const y2 = vertices[1].y;

  // (y-y1)/(y2-y1) = (x-x1)/(x2-x1)
  return ((x - x1) / (x2 - x1)) * (y2 - y1) + y1;
};

const insideLine = (vertices: Array<Position>, position: Position) => {
  // Lom diimplementasiin
  const [x, y] = convertCoordinates(position.x, position.y);
  const failCondition1 =
    x < Math.min(vertices[0].x, vertices[1].x) || x > Math.max(vertices[0].x, vertices[1].x);
  const failCondition2 =
    y < Math.min(vertices[0].y, vertices[1].y) || y > Math.max(vertices[0].y, vertices[1].y);

  if (!failCondition1 && !failCondition2) {
    return Math.abs(yCoordinateinLine(x, vertices) - y) < 0.05;
  }
  return false;
};

const insideSquare = (vertices: Array<Position>, position: Position) => {
  const [x, y] = convertCoordinates(position.x, position.y);

  const req1 = x >= Math.min(vertices[0].x, vertices[1].x, vertices[2].x, vertices[3].x);
  const req2 = x <= Math.max(vertices[0].x, vertices[1].x, vertices[2].x, vertices[3].x);
  const req3 = y >= Math.min(vertices[0].y, vertices[1].y, vertices[2].y, vertices[3].y);
  const req4 = y <= Math.max(vertices[0].y, vertices[1].y, vertices[2].y, vertices[3].y);

  return req1 && req2 && req3 && req4;
};

const insidePolygon = (vertices: Array<Position>, anchorPoint: Vec2, position: Position) => {
  const [x, y] = convertCoordinates(position.x, position.y);
  const distance = calculateDistance(x, y, anchorPoint[0], anchorPoint[1]);

  console.log(distance);
  return distance < 0.15;
};

export {
  calculateNativePosition,
  calculateClientMousePosition,
  calculateRealMousePosition,
  generateSquareVertices,
  generateRectangleVertices,
  generateLineVertices,
  generatePolygonVertices,
  insideSquare,
  insidePolygon,
  insideLine,
};
