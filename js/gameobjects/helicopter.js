"use strict";

class Helicopter extends GameObject{
    // initialisation
    constructor() {
        super();
        this.translation = [0,0];
        this.rotation = 0;
        this.speed = 0;
        const nSides = 64;
        this.points = new Float32Array(nSides * 2);

        for (let i = 0; i < nSides; i++) {
            this.points[2*i] = Math.cos(i * 2 * Math.PI/nSides);     // TODO: set the x coordinate;
            this.points[2*i+1] = Math.sin(i * 2 * Math.PI/nSides);   // TODO: set the y coordiante
        }
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
            this.translation[0] -= this.speed * deltaTime;
        }
        else if (Input.rightPressed) {
            this.translation[0] += this.speed * deltaTime;
        }
        else if (Input.upPressed) {
            this.translation[1] += this.speed * deltaTime;
        }
        else if (Input.downPressed) {
            this.translation[1] -= this.speed * deltaTime;
        }
        else if (Input.mouseClicked) {
            console.log(Input.xCoordinate, Input.yCoordinate);
            this.translation = [Input.xCoordinate, Input.yCoordinate];
            // this.translation[0] += Input.xCoordinate * this.speed * deltaTime;
            // this.translation[1] += Input.yCoordinate * this.speed * deltaTime;
        }

        // move in the current direction
        // this.translation[0] +=
        //     Math.cos(this.rotation) * this.speed * deltaTime;
        // this.translation[1] +=
        //     Math.sin(this.rotation) * this.speed * deltaTime;
    }
    // draw the helicopter
    renderSelf(gl, colourUniform) {
        check(isContext(gl),
            isUniformLocation(colourUniform));

        gl.uniform4fv(colourUniform, [0.5,0.5,0.5,1]);

        gl.bufferData(gl.ARRAY_BUFFER, this.points, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.points.length/2);

    }
}