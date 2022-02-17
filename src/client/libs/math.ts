import { Position } from '../typings';

let canvas = document.querySelector('canvas');
if (!canvas) {
  throw new Error('Canvas not found!');
}

const bound = canvas.getBoundingClientRect();

const convertCoordinates = (x: number, y: number) => {
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

const generateSquareVertices = (x: number, y: number, size: number) => {
  let output = [];
  //First triangle
  output.push(
    convertCoordinates(x, y)[0],
    convertCoordinates(x, y)[1],
    convertCoordinates(x + size, y)[0],
    convertCoordinates(x + size, y)[1],
    convertCoordinates(x + size, y + size)[0],
    convertCoordinates(x + size, y + size)[1]
  );
  //Second triangle
  output.push(
    convertCoordinates(x, y)[0],
    convertCoordinates(x, y)[1],
    convertCoordinates(x, y + size)[0],
    convertCoordinates(x, y + size)[1],
    convertCoordinates(x + size, y + size)[0],
    convertCoordinates(x + size, y + size)[1]
  );
  return output;
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

  return new Float32Array(vertices);
};

export {
  convertCoordinates,
  calculateClientMousePosition,
  calculateRealMousePosition,
  generateSquareVertices,
  generateRectangleVertices,
};
