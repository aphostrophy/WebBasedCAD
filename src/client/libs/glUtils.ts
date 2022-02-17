let glUtils = {
  checkWebGL: (canvas: HTMLCanvasElement | null) => {
    const gl = canvas?.getContext('webgl');

    if (!gl) {
      throw new Error('WebGL not supported');
    }

    return gl;
  },
  getShader: (gl: WebGLRenderingContext, type: number, source: string) => {
    let shader = gl.createShader(type);

    if (!shader) {
      throw new Error('Create shader error');
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.info(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      throw new Error('Compile shader error');
    }
    return shader;
  },
};

window.glUtils = glUtils;

export { glUtils };
