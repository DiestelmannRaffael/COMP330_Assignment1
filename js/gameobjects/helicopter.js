class Helicopter extends GameObject{
    // initialisation
    constructor() {
        super();
        this.translation = [0,0];
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
        this.translation[0] +=
            Math.cos(this.rotation) * this.speed * deltaTime;
        this.translation[1] +=
            Math.sin(this.rotation) * this.speed * deltaTime;
    }
    // draw the helicopter
    renderSelf(gl, colourUniform) {
        check(isContext(gl),
            isUniformLocation(colourUniform));

        gl.uniform4fv(colourUniform, [0.5,0.5,0.5,1]);

        // draw the helicopter
        const helicopter = new Float32Array([0,-0.5, 0,0.5, 1,0]);
        gl.bufferData(gl.ARRAY_BUFFER,
            helicopter, gl.STATIC_DRAW);

        gl.drawArrays(gl.TRIANGLES, 0, helicopter.length / 2);

    }
}