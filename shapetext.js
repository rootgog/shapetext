class ShapeText {
    constructor({
        element,
        text,
        radius,
        scale,
        range,
        speed,
        colors,
        density,
        font
    }) {
        //constructor
        this.canvas = element;
        this.ctx = this.canvas.getContext('2d');
        this.text = text;
        this.radius = radius;
        this.scale = scale;
        this.range = range;
        this.canvas.addEventListener('mousemove', this.setMousePos.bind(this));
        this.canvas.addEventListener('mouseout', this.mouseOut.bind(this));
        this.mouse = {
            x: 0,
            y: 0
        }
        this.lastFrame = Date.now();
        this.deltaTime;
        this.speed = speed;
        this.colors = colors;
        this.density = density;
        this.selection = [];
        this.font = font;
        this.getTextArea();
        this.mouseOut = false;
        return this;
    }
    mouseOut() {
        this.mouseOut = true;
    }
    setMousePos(e) {
        this.mouseOut = false;
        var rect = this.canvas.getBoundingClientRect();
        this.mouse = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }
    getTextArea() {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#000";
        this.ctx.font = `bold ${this.canvas.height}px ${this.font}`;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(
            this.text,
            this.canvas.width / 2,
            this.canvas.height / 2,
            this.canvas.width
        );
        var textArea = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var pixels = textArea.data;
        this.textPixels = [];
        var radius = this.radius;
        for (var pixel = 0; pixel < pixels.length; pixel += 4) {
            if (pixels[pixel] + pixels[pixel + 1] + pixels[pixel + 2] == 0 &&
                pixels[pixel + 3] > 0) {
                //r=0,g=0,b=0,a>0
                var x = (pixel / 4) % this.canvas.width;
                var y = Math.floor((pixel / 4) / this.canvas.width);
                var color = this.colors.sort(() => 0.5 - Math.random()).slice(0, 1);
                this.textPixels.push({
                    x,
                    y,
                    radius,
                    color
                });
            }
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var shuffled = [];
        for (let i = 0; i < this.textPixels.length; i++) {
            shuffled.push(
                this.textPixels.splice(
                    Math.floor(Math.random() * this.textPixels.length),
                    1
                )[0]
            );
        }
        this.selection = shuffled.slice(0, this.textPixels.length * this.density);
    }
    draw() {
        this.deltaTime = (Date.now() - this.lastFrame) / 1000;
        this.lastFrame = Date.now();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.selection.length; i++) {
            var pixel = this.selection[i];
            var distance = Math.hypot(this.mouse.x - pixel.x, this.mouse.y - pixel.y);
            if (distance < this.radius + this.range && !this.mouseOut) {
                //mouse in range
                if (this.selection[i].radius < this.radius * this.scale) {
                    var newRadius = this.selection[i].radius + this.speed * this.deltaTime;
                    if (newRadius > this.radius * this.scale) {
                        newRadius = this.radius * this.scale;
                    }
                    this.selection[i].radius = newRadius;
                }
            } else {
                if (this.selection[i].radius > this.radius) {
                    var newRadius = this.selection[i].radius - this.speed * this.deltaTime;
                    if (newRadius < this.radius) {
                        newRadius = this.radius;
                    }
                    this.selection[i].radius = newRadius;
                }
            }
            this.ctx.beginPath();
            this.ctx.fillStyle = pixel.color;
            this.ctx.arc(pixel.x, pixel.y, this.selection[i].radius, 0, 2 * Math.PI);
            this.ctx.fill();
        };

        requestAnimationFrame(() => this.draw());
    }
}

export {
    ShapeText
}