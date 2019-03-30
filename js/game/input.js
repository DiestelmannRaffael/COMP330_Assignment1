"use strict";

/**
 * Input manager.
 * 
 * This class listens for keydown and keyup events to keep track of whether the arrow keys are currently pressed.
 * 
 * Usage:
 * 
 * if (Input.leftPressed) {
 *     // the left arrow is pressed
 * }
 */

const InputClass = function() {
    const input = this;

    input.leftPressed = false;
    input.rightPressed = false;
    input.upPressed = false;
    input.downPressed = false;
    input.mouseClicked = false;

    input.onKeyDown = function(event) {
        switch (event.key) {
            case "ArrowLeft":
                input.leftPressed = true;
                break;

            case "ArrowRight":
                input.rightPressed = true;
                break;

            case "ArrowDown":
                input.downPressed = true;
                break;

            case "ArrowUp":
                input.upPressed = true;
                break;
        }
    }

    input.onKeyUp = function(event) {
        switch (event.key) {
            case "ArrowLeft":
                input.leftPressed = false;
                break;

            case "ArrowRight":
                input.rightPressed = false;
                break;

            case "ArrowDown":
                input.downPressed = false;
                break;

            case "ArrowUp":
                input.upPressed = false;
                break;
        }
    }

    input.onMouseClick = function(event) {
        let canvas = document.getElementById("c");

        // Conversion code © by user https://stackoverflow.com/users/978057/lj%E1%9B%83
        // https://stackoverflow.com/questions/37822775/make-mouse-coordinates-relative-to-canvas-coordinates
        input.xCoordinate = (event.offsetX / canvas.clientWidth) * 2 - 1;
        input.yCoordinate = (1 - (event.offsetY / canvas.clientHeight)) * 2 - 1;

        input.mouseClicked = true;
    }

    document.addEventListener("keydown", input.onKeyDown);
    document.addEventListener("keyup", input.onKeyUp);
    document.addEventListener("click", input.onMouseClick);

}

// global inputManager variable
const Input = new InputClass();