export function startWebGL() {

  const canvas = document.getElementById("live6dCanvas");
  const gl = canvas.getContext("webgl");

  if (!gl) {
    alert("WebGL wird nicht unterstützt.");
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  /* Shader */
  const vertex = `
    attribute vec3 pos;
    uniform mat4 rot;
    void main(){
      gl_Position = rot * vec4(pos, 1.0);
      gl_PointSize = 4.0;
    }
  `;

  const fragment = `
    precision mediump float;
    uniform float time;
    void main(){
      gl_FragColor = vec4(
        abs(sin(time)),
        abs(cos(time * 0.5)),
        0.8,
        1.0
      );
    }
  `;

  function compile(type, src){
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const vs = compile(gl.VERTEX_SHADER, vertex);
  const fs = compile(gl.FRAGMENT_SHADER, fragment);

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  /* 756 Achsen laden */
  Promise.all([
    fetch("axes.json").then(r => r.json()),
    fetch("diagonal.json").then(r => r.json())
  ]).then(([axes, diag]) => {

    const points = [];

    for (let i = 0; i < 756; i++) {

      // Achsen-ID → Position
      const ax = axes[i].id;

      // Diagonalwert → Rotation / Morph
      const d = diag[i].diag;

      const x = Math.sin(ax * 0.1) * 0.8;
      const y = Math.cos(d * 0.05) * 0.8;
      const z = Math.sin(d * 0.03) * Math.cos(ax * 0.07);

      points.push(x, y, z);
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, "pos");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);

    const rotLoc = gl.getUniformLocation(prog, "rot");
    const timeLoc = gl.getUniformLocation(prog, "time");

    let angle = 0;

    function draw(){
      gl.clearColor(0,0,0,1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      angle += 0.01;

      const c = Math.cos(angle);
      const s = Math.sin(angle);

      const rot = new Float32Array([
        c, 0, s, 0,
        0, 1, 0, 0,
        -s, 0, c, 0,
        0, 0, 0, 1
      ]);

      gl.uniformMatrix4fv(rotLoc, false, rot);
      gl.uniform1f(timeLoc, performance.now() / 1000);

      gl.drawArrays(gl.POINTS, 0, 756);

      requestAnimationFrame(draw);
    }

    draw();
  });
}
