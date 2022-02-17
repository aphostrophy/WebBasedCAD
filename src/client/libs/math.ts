import AppState from '../entity/AppState';

let canvas = document.querySelector('canvas');
if (!canvas) {
  throw new Error('Canvas not found!');
}

const convertCoordinates = (x: number, y: number) => {
  canvas = canvas as HTMLCanvasElement;
  let midX = canvas.width / 2;
  let midY = canvas.height / 2;
  let outputX = (x - midX) / midX;
  let outputY = (midY - y) / midY;
  return [outputX, outputY];
};

const createSquare = (x: number, y: number, size: number) => {
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

export { convertCoordinates, createSquare };
