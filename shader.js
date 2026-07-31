function startShader(){
  const canvas = document.getElementById("live6dCanvas");
  const gl = canvas.getContext("webgl");

  const vertex = `
    attribute vec2 pos;
    void main(){ gl_Position = vec4(pos, 0.0, 1.0); }
  `;
  const fragment = `
    precision mediump float;
    void main(){ gl_FragColor = vec4(0.2, 0.8, 1.0, 1.0); }
  `;

  // Shader kompilieren
  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vertex);
  gl.compileShader(vs);

  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fragment);
  gl.compileShader(fs);

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const vertices = new Float32Array([
    -0.5,-0.5, 0.5,-0.5, 0.0,0.5
  ]);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const pos = gl.getAttribLocation(prog, "pos");
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  gl.clearColor(0,0,0,1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}
