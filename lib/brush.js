/*
 * Filename:        brush.js
 * Author:          Harrison Hubbell
 * Date:            04/08/2015
 * Description:     Brush Object for painting on a canvas.
 */

/**
 * Brush: Parent Object for all Brush types.
 * @param ctx:      Canvas context
 * @param coord:   Brush location ([x, y])
 * @param stroke:   Brush stroke size
 * @optional color: Stroke color
 */
function Brush(ctx, coord, stroke, color) {
    this.ctx = ctx;
    this.coord = coord;
    this.stroke = stroke;
    this.color = color || '#000000';

    this.ctx.canvas.width = this.ctx.canvas.clientWidth;
    this.ctx.canvas.height = this.ctx.canvas.clientHeight;
    this.ctx.lineWidth = this.stroke;
    this.ctx.strokeStyle = this.color;
    this.ctx.fillStyle = this.color;
}

/**
 * Brush.setColor: Set color to paint
 * @param color:    Hexidecimal representation of color
 */
Brush.prototype.setColor = function (color) {
    this.color = color;
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
}

/**
 * Brush.move: Generate the next location for paint.
 * @param max:      Max step to next location
 * @optional neg:   Is the brush allowed to go off screen?
 */
Brush.prototype.move = function (max, neg) {
    var newc = [];
    
    max = (max) ? max : 1;

    newc[0] = this.coord[0] + max * ((Math.floor(Math.random() * 2) === 1) ? 1 : -1);
    newc[1] = this.coord[1] + max * ((Math.floor(Math.random() * 2) === 1) ? 1 : -1);

    if (!neg) {
        if (newc[0] >= this.ctx.canvas.clientWidth || newc[0] <= 0) {
            newc[0] = this.coord[0];
        }

        if (newc[1] >= this.ctx.canvas.clientHeight || newc[1] <= 0) {
            newc[1] = this.coord[1];
        }
    }
    
    this.coord = newc;
}

/**
 * Brush.randomResize: Generate a new stroke width randomly
 * @param max:      Max brush size
 */
Brush.prototype.randomResize = function (max) {
    this.stroke = Math.floor(Math.random() * max)
    this.ctx.lineWidth = this.stroke;
}

/**
 * Brush.smoothResize: Generate a new stroke width based on previous width
 * @param step:     Max brush step size
 */
Brush.prototype.smoothResize = function (step) {
    this.stroke += max * ((Math.floor(Math.random() * 2) === 1) ? 1 : -1);
    this.ctx.lineWidth = this.stroke;
}

/**
 * CircleBrush: Object for circle brushes
 * @param ctx:      Canvas context
 * @param coord:    Brush location ([x, y])
 * @param stroke:   Brush stroke size
 * @param radius:   Brush circle radius
 * @optional color: Stroke color
 */
function CircleBrush(ctx, coord, stroke, radius, color) {
    Brush.call(this, ctx, coord, stroke, color);
    this.radius = radius;
}
CircleBrush.prototype = Object.create(Brush.prototype);
CircleBrush.prototype.constructor = CircleBrush;

/**
 * CircleBrush.spinDraw: Draw a spinning circle
 * @param start:    Last iterations end point
 * @param distance: Arc length (radians)
 * @return:         Total arc length (radians)
 */
CircleBrush.prototype.spinDraw = function (start, distance) {
    var x = coord[0];
    var y = coord[1];
    var end = start + distance;

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + this.radius, y);
    this.ctx.arc(x, y, this.radius, 0, end);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();

    return end;
}

/**
 * CircleBrush.draw: Stamp a solid circle on the canvas
 */
CircleBrush.prototype.draw = function () {
    this.ctx.beginPath();
    this.ctx.arc(this.coord[0], this.coord[1], this.radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
}

/**
 * CircleBrush.randomResize: Generate a new radius randomly
 * @override:       Brush.randomResize
 * @param max:      Max brush size
 */
CircleBrush.prototype.randomResize = function (max) {
    this.radius = Math.floor(Math.random() * max)
}

/**
 * CircleBrush.smoothResize:    Generate a new stroke width based on
 *                              previous width
 * @override:       Brush.smoothResize
 * @param step:     Max brush step size
 */
CircleBrush.prototype.smoothResize = function (step) {
    this.radius += max * ((Math.floor(Math.random() * 2) === 1) ? 1 : -1);
}
