class House extends GameObject{
    constructor(x, y) {
        check(isNumber(x, y));
        super();
        this.translation = [x, y];
    }
    renderSelf(gl, colourUniform) {
        check(isContext(gl), isUniformLocation(colourUniform));

        gl.uniform4fv(colourUniform, [0.5, 0.3, 0.1, 1]);

        // draw the house
        const house = new Float32Array(
            [0,0,0.5,0,0.5,0.5,
                            0,0,0,0.5,0.5,0.5,
                            0,0.5,0.5,0.5,0.25,0.75]);

        gl.bufferData(gl.ARRAY_BUFFER,
            house, gl.STATIC_DRAW);

        gl.drawArrays(gl.TRIANGLES, 0, 9);
    }
}