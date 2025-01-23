class LoadingAnimation {

    static start() { 
        const center = new Vector(CANVAS.width / 2, CANVAS.height / 2);
        
        this.circles = [
            { x: center.x - 50, y: center.y, dy: 20},
            { x: center.x, y: center.y, dy: 20},
            { x: center.x + 50, y: center.y, dy: 20}
        ];
        this.currentCircle = 0;
        this.intervalId = null;

        // setInterval() is the reason GameEngine does not control the update-render loop.

        // setInterval() repeatedly calls a function or executes a code snippet, 
        // with a fixed time delay between each call.
        // https://developer.mozilla.org/en-US/docs/Web/API/setInterval
        this.intervalId = setInterval(() => this.fixedUpdate(), 100);
    }

    static stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    static fixedUpdate() {
        // Clear the canvas
        CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

        // Update and draw each circle
        for (let i = 0; i < this.circles.length; i++) {
            let circle = this.circles[i];

            // If this is the current circle, make it bounce and squish
            if (i === this.currentCircle) {
                circle.y += circle.dy;
                if (circle.y > LoadingAnimation.LOWER_BOUND || circle.y < LoadingAnimation.HIGHER_BOUND) {
                    circle.dy *= -1;
                }
            }

            // Draw the circle
            CTX.beginPath();
            CTX.ellipse(circle.x, circle.y, 20, 20, 0, 0, Math.PI * 2);
            CTX.fillStyle = COLORS.GRAY;
            CTX.fill();

            // Outline the circle
            CTX.lineWidth = 3;
            CTX.strokeStyle = COLORS.BLACK;
            CTX.stroke();
        }

        // Move to the next circle
        this.currentCircle = (this.currentCircle + 1) % this.circles.length;
    }

    static get LOWER_BOUND() {
        return CANVAS.height/2 - 50;
    }

    static get HIGHER_BOUND() {
        return CANVAS.height/2 + 50;
    }
}