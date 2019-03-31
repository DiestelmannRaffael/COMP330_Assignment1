"use strict";

class Helicopter extends GameObject{
    // initialisation
    constructor() {
        super();
        this.translation = [0,0];
        this.rotation = 0;
        this.speed = 0;
        const nSides = 64;
        this.mouseControl = true;
        this.points = new Float32Array(nSides * 2);

        for (let i = 0; i < nSides; i++) {
            this.points[2*i] = Math.cos(i * 2 * Math.PI/nSides);     // TODO: set the x coordinate;
            this.points[2*i+1] = Math.sin(i * 2 * Math.PI/nSides);   // TODO: set the y coordiante
        }
    }
    // update the helicopter on each frame
    //TODO: Fix bug where position gets set back to click coordinates after control with keyboard.
    update(deltaTime) {
        check(isNumber(deltaTime));
        if(!Input.leftPressed && !Input.rightPressed && !Input.upPressed && !Input.downPressed && !Input.mouseClicked) {
            this.speed = 0;
        } else {
            this.speed = 0.5;
        }

        // rotate the head
        if (Input.leftPressed) {
            this.mouseControl = false;
            this.translation[0] -= this.speed * deltaTime;
        }
        else if (Input.rightPressed) {
            this.mouseControl = false;
            this.translation[0] += this.speed * deltaTime;
        }
        else if (Input.upPressed) {
            this.mouseControl = false;
            this.translation[1] += this.speed * deltaTime;

        }
        else if (Input.downPressed) {
            this.mouseControl = false;
            this.translation[1] -= this.speed * deltaTime;
        }
        else if (Input.mouseClicked) {
            this.mouseControl = true;
            console.log(this.translation[0] + " " + this.translation[1]);
            if(this.mouseControl) {
                if (Input.xCoordinate > this.translation[0]) {
                    this.translation[0] += this.speed * deltaTime;
                } else {
                    this.translation[0] -= this.speed * deltaTime;
                }
                if (Input.yCoordinate > this.translation[1]) {
                    this.translation[1] += this.speed * deltaTime;
                } else {
                    this.translation[1] -= this.speed * deltaTime;
                }
            }
        }

        // move in the current direction
        // this.translation[0] +=
        //     Math.cos(this.rotation) * this.speed * deltaTime;
        // this.translation[1] +=
        //     Math.sin(this.rotation) * this.speed * deltaTime;
    }

    handleMouseClick() {
        if(Input.xCoordinate > this.translation[0]) {
            this.translation[0] += this.speed * deltaTime;
        }
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