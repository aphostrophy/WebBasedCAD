(function (global) {
  let glUtils = {
    checkWebGL: (canvas: HTMLCanvasElement | null) => {
      const gl = canvas?.getContext('webgl');

      if (!gl) {
        throw new Error('WebGL not supported');
      }

      return gl;
    },
  };
  global.glUtils = glUtils;
})(window || this);
