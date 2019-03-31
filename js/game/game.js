"use strict";

// Shader code

const vertexShaderSource = `
attribute vec4 a_position;
uniform mat3 u_worldMatrix;
void main() {
 // convert to homogeneous coordinates
 vec3 p = vec3(a_position.xy, 1);
 // multiply by world martix
 p = u_worldMatrix * p;
// output to gl_Position
 gl_Position = vec4(p.xy, 0, 1);
}
`;

const fragmentShaderSource = `
precision mediump float;
uniform vec4 u_colour;

void main() {
  gl_FragColor = u_colour; 
}
`;
var frontRotor, backRotor;

function createShader(gl, type, source) {
    check(isContext(gl), isString(source));

    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    check(isContext(gl), isShader(vertexShader, fragmentShader));

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

function resize(canvas) {
    check(isCanvas(canvas));

    const resolution = window.devicePixelRatio || 1.0;

    const displayWidth =
        Math.floor(canvas.clientWidth * resolution);
    const displayHeight =
        Math.floor(canvas.clientHeight * resolution);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        return true;
    } else {
        return false;
    }
}

function main() {

    // === Initialisation ===

    // get the canvas element & gl rendering 
    const canvas = document.getElementById("c");
    const gl = canvas.getContext("webgl");

    if (gl === null) {
        window.alert("WebGL not supported!");
        return;
    }

    // create GLSL shaders, upload the GLSL source, compile the shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);


    // Initialise the shader attributes & uniforms
    const positionAttribute = gl.getAttribLocation(program, "a_position");
    const worldMatrixUniform = gl.getUniformLocation(program, "u_worldMatrix");
    const colourUniform = gl.getUniformLocation(program, "u_colour");

    // Initialise the array buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);


    // === Per Frame operations ===

    // Init Game Objects
    let helipad = initHeliPad();
    let helicopter = initHelicopter(helipad.translation[0], helipad.translation[1]);
    let houses = initHouses();

    const river = new River();
    const h = new H();

    // update objects in the scene
    let update = function (deltaTime) {
        check(isNumber(deltaTime));

        frontRotor.rotation -= Math.PI * 2 * deltaTime;
        backRotor.rotation += Math.PI * 2 * deltaTime;

        helicopter.update(deltaTime);

    };

    // redraw the scene
    let render = function () {
        // clear the screen
        gl.viewport(0, 0, canvas.width, canvas.height);

        const aspect = canvas.width / canvas.height;

        gl.clearColor(0, 1, 0.1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        for (let i = 0; i < houses.length; i++) {
            houses[i].render(gl, worldMatrixUniform, colourUniform, Matrix.identity());
        }

        river.render(gl, worldMatrixUniform, colourUniform);
        helipad.render(gl, worldMatrixUniform, colourUniform, Matrix.identity());
        helicopter.render(gl, worldMatrixUniform, colourUniform, Matrix.identity());

    };

    // animation loop
    let oldTime = 0;
    let animate = function (time) {
        check(isNumber(time));

        time = time / 1000;
        let deltaTime = time - oldTime;
        oldTime = time;

        resize(canvas);
        update(deltaTime);
        render();

        requestAnimationFrame(animate);
    }

    // start it going
    animate(0);
}

// Returns initialized helicopter
function initHelicopter(x, y) {
    const helicopter = new Helicopter();
    helicopter.scale = [0.1, 0.2];
    helicopter.translation = [x, y];

    frontRotor = new Rotor();
    frontRotor.parent = helicopter;
    frontRotor.translation = [0,0.5];

    backRotor = new Rotor();
    backRotor.parent = helicopter;
    backRotor.scale = [0.5,0.5];
    backRotor.translation = [0,-0.9];

    return helicopter;
}

function initHeliPad() {
    const helipad = new Circle(64);
    helipad.scale = [0.3,0.3];
    helipad.translation = [0.55, 0.5];

    const h = new H();
    h.scale = [0.8, 0.8];
    h.parent = helipad;


    return helipad;
}

// Returns array of initialized houses
function initHouses() {
    //houses
    var houses = [
        new House(-0.7, 0.7),
        new House(-0.9, 0.8),
        new House(-0.85, 0.6),
        new House(-0.55, 0.6),
        new House(-0.55, 0.8),
    ];
    for (let i = 0; i < houses.length; i++) {
        houses[i].scale = [0.2, 0.2];
    }

    //windows
    let windows = [];
    for(let i = 0; i < houses.length; i++) {
        windows[i] = new Window();
    }
    
    for (let i = 0; i < windows.length; i++) {
        windows[i].scale = [0.1, 0.1];
        windows[i].translation = [0.25, 0.5];
        windows[i].parent = houses[i];
    }

    //doors
    let doors = [];

    for(let i = 0; i < houses.length; i++) {
        doors[i] = new Door();
    }

    for (let i = 0; i < doors.length; i++) {
        doors[i].scale = [0.3, 0.3];
        doors[i].translation = [0.17, 0.02];
        doors[i].parent = houses[i];
    }

    //doorknobs
    let doorknobs = [];
    for(let i = 0; i < doors.length; i++) {
        doorknobs[i] = new Circle(8);
    }

    for (let i = 0; i < doorknobs.length; i++) {
        doorknobs[i].scale = [0.1, 0.1];
        doorknobs[i].translation = [0.35, 0.5];
        doorknobs[i].parent = doors[i];
    }
    return houses;
}
