interface Window {
  glUtils: {
    checkWebGL: (canvas: HTMLCanvasElement | null) => WebGLRenderingContext;
  };
}
