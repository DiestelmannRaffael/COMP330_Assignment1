class River {
    render(gl, worldMatrixUniform, colourUniform) {
        check(isContext(gl),
            isUniformLocation(worldMatrixUniform, colourUniform));

        // set the uniforms
        let matrix = Matrix.trs(
            0,0, 0, 1, 1);

        gl.uniformMatrix3fv(
            worldMatrixUniform, false, matrix);

        gl.uniform4fv(colourUniform, [0, 0, 1, 1]);

        // draw the head
        const river = new Float32Array([-0.2, -1, 0.2, -1, 0.2, 1, 0.2, 1, -0.2, 1, -0.2, -1]);
        gl.bufferData(gl.ARRAY_BUFFER,
            river, gl.STATIC_DRAW);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}