class House {
    constructor(x, y) {
        this.position = [x, y];
    }
    render(gl, worldMatrixUniform, colourUniform) {
        check(isContext(gl),
            isUniformLocation(worldMatrixUniform, colourUniform));

        // set the uniforms
        let matrix = Matrix.trs(this.position[0], this.position[1], 0, 0.2, 0.2);

        gl.uniformMatrix3fv(
            worldMatrixUniform, false, matrix);

        gl.uniform4fv(colourUniform, [0.5, 0.3, 0.1, 1]);

        // draw the house
        const house = new Float32Array(
            [0,0,0.5,0,0.5,0.5,
                            0,0,0,0.5,0.5,0.5,
                            0,0.5,0.5,0.5,0.25,0.75]);

        // const house = new Float32Array([-1,-1,0,0,0,-1]);
        gl.bufferData(gl.ARRAY_BUFFER,
            house, gl.STATIC_DRAW);

        gl.drawArrays(gl.TRIANGLES, 0, 9);
    }
}