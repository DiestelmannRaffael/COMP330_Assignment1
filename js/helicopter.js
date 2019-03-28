class Helicopter {
    // initialisation
    constructor() {
        this.position = [0,0];
        this.rotation = 0;
        this.speed = 0;
    }
    // update the helicopter on each frame
    update(deltaTime) {
        check(isNumber(deltaTime));
        if(!Input.leftPressed && !Input.rightPressed && !Input.upPressed && !Input.downPressed) {
            this.speed = 0;
        } else {
            this.speed = 0.5;
        }

        // rotate the head
        if (Input.leftPressed) {
            this.rotation = Math.PI;
        }
        else if (Input.rightPressed) {
            this.rotation = 0;
        }
        else if (Input.upPressed) {
            this.rotation = Math.PI/2;
        }
        else if (Input.downPressed) {
            this.rotation = 3*Math.PI/2;
        }

        // move in the current direction
        this.position[0] +=
            Math.cos(this.rotation) * this.speed * deltaTime;
        this.position[1] +=
            Math.sin(this.rotation) * this.speed * deltaTime;
    }
    // draw the helicopter
    render(gl, worldMatrixUniform, colourUniform) {
        check(isContext(gl),
            isUniformLocation(worldMatrixUniform, colourUniform));

        // set the uniforms
        let matrix = Matrix.trs(
            this.position[0], this.position[1],
            this.rotation, 0.2, 0.2);

        gl.uniformMatrix3fv(
            worldMatrixUniform, false, matrix);

        gl.uniform4fv(colourUniform, [0.5,0.5,0.5,1]);

        // draw the helicopter
        const helicopter = new Float32Array([0,-0.5, 0,0.5, 1,0]);
        gl.bufferData(gl.ARRAY_BUFFER,
            helicopter, gl.STATIC_DRAW);

        gl.drawArrays(gl.TRIANGLES, 0, helicopter.length / 2);

    }
}