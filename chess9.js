export function startChess9() {

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
    uniform float time;

    vec3 morph(vec3 p){
      p.x += sin(time + p.x * 3.0) * 0.05;
      p.y += cos(time + p.z * 2.0) * 0.05;
      p.z += sin(time + p.y * 4.0) * 0.05;
      return p;
    }

    void main(){
      vec3 m = morph(pos);
      gl_Position = rot * vec4(m, 1.0);
      gl_PointSize = 8.0;
    }
  `;

  const fragment = `
    precision mediump float;
    uniform float time;
    void main(){
      gl_FragColor = vec4(
        abs(sin(time)),
        abs(cos(time * 0.5)),
        abs(sin(time * 0.3)),
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

  /* 9×9 Brett erzeugen */
  const board = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {

      const x = (col - 4) * 0.25;
      const y = 0;
      const z = (row - 4) * 0.25;

      board.push(x, y, z);
    }
  }

  /* Figuren platzieren */
  const pieces = new Array(81).fill(null);

  function placePieces(){
    // Bauern
    for(let i=9; i<18; i++) pieces[i] = "pawn";
    for(let i=63; i<72; i++) pieces[i] = "pawn";

    // Türme
    pieces[0] = "rook";
    pieces[8] = "rook";
    pieces[72] = "rook";
    pieces[80] = "rook";

    // Springer
    pieces[1] = "knight";
    pieces[7] = "knight";
    pieces[73] = "knight";
    pieces[79] = "knight";

    // Läufer
    pieces[2] = "bishop";
    pieces[6] = "bishop";
    pieces[74] = "bishop";
    pieces[78] = "bishop";

    // Dame
    pieces[3] = "queen";
    pieces[75] = "queen";

    // König
    pieces[4] = "king";
    pieces[76] = "king";
  }

  placePieces();

  /* Brett + Figuren kombinieren */
  const points = [];

  for(let i=0;i<81;i++){
    const x = board[i*3];
    const y = board[i*3+1];
    const z = board[i*3+2];

    points.push(x, y, z);

    if(pieces[i]){
      points.push(x, y+0.15, z);
    }
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

    gl.drawArrays(gl.POINTS, 0, points.length / 3);

    requestAnimationFrame(draw);
  }

  draw();
}
