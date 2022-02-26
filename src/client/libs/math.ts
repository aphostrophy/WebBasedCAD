import { diffieHellman } from 'crypto';
import { NativePosition, Position, Vec2 } from '../typings';

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

const calculateNativePosition = (realPos: Position): NativePosition => {
  const { x: realX, y: realY } = realPos;
  const midX = (canvas.width - bound.left) / 2;
  const midY = (canvas.height - bound.top) / 2;
  return {
    x: (realX - midX) / midX,
    y: (midY - realY) / midY,
  };
};

const convertNativeToRealPosition = (nativePos: NativePosition): Position => {
  const { x: nativeX, y: nativeY } = nativePos;
  const midX = (canvas.width - bound.left) / 2;
  const midY = (canvas.height - bound.top) / 2;
  return {
    x: nativeX * midX + midX,
    y: midY - nativeY * midY,
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

const generateSquareVertices2 = (startPoint: Position, length: number) => {
  const vertices = new Array<number>();

  const topLeftPoint = convertCoordinates(startPoint.x, startPoint.y);
  const bottomLeftPoint = convertCoordinates(startPoint.x, startPoint.y + length);
  const topRightPoint = convertCoordinates(startPoint.x + length, startPoint.y);
  const bottomRightPoint = convertCoordinates(startPoint.x + length, startPoint.y + length);

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

const xCoordinateinLine = (y: number, vertices: Array<Position>) => {
  const x1 = vertices[0].x;
  const x2 = vertices[1].x;
  const y1 = vertices[0].y;
  const y2 = vertices[1].y;

  // (y-y1)/(y2-y1) = (x-x1)/(x2-x1)
  return ((y - y1) / (y2 - y1)) * (x2 - x1) + x1;
};

const insideLine = (vertices: Array<Position>, position: Position) => {
  // Lom diimplementasiin
  const [x, y] = convertCoordinates(position.x, position.y);
  const failCondition1 =
    x < Math.min(vertices[0].x, vertices[1].x) || x > Math.max(vertices[0].x, vertices[1].x);
  const failCondition2 =
    y < Math.min(vertices[0].y, vertices[1].y) || y > Math.max(vertices[0].y, vertices[1].y);

  if (!failCondition1 && !failCondition2) {
    return (
      Math.abs(yCoordinateinLine(x, vertices) - y) < 0.05 ||
      Math.abs(xCoordinateinLine(y, vertices) - x) < 0.05
    );
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

const insidePolygon = (vertices: Array<Position>, position: Position) => {
  var is_in = false;
  const n = vertices.length;
  const [x, y] = convertCoordinates(position.x, position.y);

  for (var i = 0; i < n - 1; ++i) {
    const x1 = vertices[i].x;
    const x2 = vertices[i + 1].x;
    const y1 = vertices[i].y;
    const y2 = vertices[i + 1].y;

    if (y < y1 != y < y2 && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) {
      is_in = !is_in;
    }
  }

  return is_in;
};

// Generating square coordinates for a vertice
const generatePointVertice = (vertices: Position) => {
  const diff = 4;
  const input = convertNativeToRealPosition(vertices);
  input.x -= diff;
  input.y -= diff;
  const output = generateSquareVertices2(input, 2 * diff);

  return output;
};

export {
  calculateNativePosition,
  calculateClientMousePosition,
  calculateRealMousePosition,
  convertNativeToRealPosition,
  generateSquareVertices,
  generateSquareVertices2,
  generateRectangleVertices,
  generateLineVertices,
  generatePolygonVertices,
  insideSquare,
  insidePolygon,
  insideLine,
  generatePointVertice,
};
