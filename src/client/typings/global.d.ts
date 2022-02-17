interface Window {
  glUtils: {
    checkWebGL: (canvas: HTMLCanvasElement | null) => WebGLRenderingContext;
    getShader: (gl: WebGLRenderingContext, type: number, source: string) => WebGLShader;
  };
}
