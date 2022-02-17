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

  createProgram: (
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ) => {
    let program = gl.createProgram();

    if (!program) {
      throw new Error('Create program error');
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.validateProgram(program);

    if (
      !gl.getProgramParameter(program, gl.LINK_STATUS) ||
      !gl.getProgramParameter(program, gl.VALIDATE_STATUS)
    ) {
      let error = gl.getProgramInfoLog(program);
      console.info(error);
      gl.deleteProgram(program);
      gl.deleteShader(fragmentShader);
      gl.deleteShader(vertexShader);
      throw new Error('Failed to link or validate program');
    }

    return program;
  },
};

window.glUtils = glUtils;

export { glUtils };
