export const resizer = (canvas: HTMLCanvasElement, gl: WebGLRenderingContext) => {
  (canvas as HTMLCanvasElement).width = window.innerWidth;
  (canvas as HTMLCanvasElement).height = window.innerHeight;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
};
