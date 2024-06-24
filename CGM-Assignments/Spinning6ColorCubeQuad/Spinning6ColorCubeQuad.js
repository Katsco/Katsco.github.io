/*
 * Course: CS 4722
 * Section: 01
 * Name: Katlin Scott
 * Professor: Alan Shaw
 * Assignment #: Mod 2 Assignment 2 Part 2
 */

"use strict";

var canvas;
var gl;

var theta = vec3(45, 45, 45);
var thetaLoc;

var axis = 0;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var vertices = [
    vec3(-0.5, -0.5, 0.5),
    vec3(-0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, -0.5, 0.5),
    vec3(-0.5, -0.5, -0.5),
    vec3(-0.5, 0.5, -0.5),
    vec3(0.5, 0.5, -0.5),
    vec3(0.5, -0.5, -0.5),
];

var vertexColors = [
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(1.0, 1.0, 1.0, 1.0),  // white
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0)   // magenta
];

var points = [];
var colors = [];

// State variable for changing colors
var firstColors = true;

var vertexColors2 = [
    vec4(0.9, 0.1, 0.2, 1.0),  // crimson
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.5, 0.0, 1.0),  // dark orange
    vec4(0.6, 0.4, 0.9, 1.0),  // medium purple
    vec4(0.0, 0.7, 1.0, 1.0),  // deep sky blue
    vec4(1.0, 1.0, 1.0, 1.0),  // white
    vec4(0.4, 0.4, 0.8, 1.0),  // slate blue
    vec4(0.5, 1.0, 0.8, 1.0)   // aquamarine
];


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    makeCube(); // Added call

    // vertex array attribute buffer code goes here
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // color array attribute buffer code goes here
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // thetaLoc uniform variable code goes here
    thetaLoc = gl.getUniformLocation(program, "theta");
    gl.uniform3fv(thetaLoc, theta);

    // array element buffer for vertex indices
    /*
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
    */

    // button handlers code goes here
    document.getElementById("xButton").onclick =
        function () {
            axis = xAxis;
        };
    document.getElementById("yButton").onclick =
        function () {
            axis = yAxis;
        };
    document.getElementById("zButton").onclick =
        function () {
            axis = zAxis;
        };

    document.getElementById("colorButton").onclick =
        function () {
            firstColors = !firstColors;
            points = [];
            colors = [];
            makeCube();
            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
        };

    render();
}

function makeCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(5, 1, 2, 6);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

function quad(a, b, c, d) {
    var indices = [a, b, c, a, c, d];
    for (var i = 0; i < indices.length; ++i) {
        points.push(vertices[indices[i]]);

        // for solid colored faces
        //colors.push(vertexColors[c]);
        if (firstColors) {
            colors.push(vertexColors[c]);
        } else {
            colors.push(vertexColors2[c]);
        }
    }
}

function render() {
    // render code goes here
    //gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    theta[axis] += 2;
    gl.uniform3fv(thetaLoc, theta); // thetaLoc = global variable now because we removed 'var' in uniform variable

    //gl.drawArrays(gl.TRIANGLES, 0, points.length);
    //gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
    requestAnimFrame(render);
}