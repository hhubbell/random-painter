/*
 * Filename:    main.js
 * Author:      Harrison Hubbell
 * Date:        December 18, 2014
 * Description: Control the brush of the random painter
 */


/**
 * pulse: Change the background color of an element from white
 * to the current circle color
 * @param el:   Element to color
 * @param to:   Color to move to
 * @param dir:  Moving towards or away from the color
 * @return:     Direction to move next iteration
 */
function pulse(el, to, dir) {
    var SMOOTHING = 1;
    var RGB_RE = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(1|0\.\d+))?\)$/;

    var to = rgb(to);
    var from = el.style.backgroundColor.match(RGB_RE);
    var all_done = false;
    var fr;
    var fg;
    var fb;

    from = (from) ? from.slice(1,4) : [255, 255, 255];

    fr = parseInt(from[0]);
    fg = parseInt(from[1]);
    fb = parseInt(from[2]);

    all_done = (fr <= to.r || fr >= 255) &&
                (fg <= to.g || fg >= 255) &&
                (fb <= to.b || fb >= 255);

    if (fr > to.r && dir[0] === -1 || fr < 255 && dir[0] === 1) {
        fr += SMOOTHING * dir[0];
    } else if (all_done) {
        dir[0] *= -1;
    }

    if (fg > to.g && dir[1] === -1 || fg < 255 && dir[1] === 1) {
        fg += SMOOTHING * dir[1];
    } else if (all_done) {
        dir[1] *= -1;
    }

    if (fb > to.b && dir[2] === -1 || fb < 255 && dir[2] === 1) {
        fb += SMOOTHING * dir[2];
    } else if (all_done) {
        dir[2] *= -1;
    }

    el.style.backgroundColor = '#' + hex(fr) + hex(fg) + hex(fb);

    return dir;
}

/**
 * show: Log data to HUD
 * @param c:    Coordinates ([x, y])
 * @param r:    Radius 
 * @param l:    Color (hex)
 */
function show(c, r, l) {
    var col = l.rgb();
    var str = '(' + col.r + ', ' + col.g + ', ' + col.b + ')';

    document.getElementById('xcoord').innerHTML = c[0];
    document.getElementById('ycoord').innerHTML = c[1];
    document.getElementById('radius').innerHTML = r;
    document.getElementById('current-color').innerHTML = l.hex();
    document.getElementById('rgb-color').innerHTML = str;
}

/**
 * hex: Convert an integer between 0 and 255 to its hexidecimal val
 * @param val:  Color integer
 * @return:     Hexidecimal value
 *
 */
function hex(val) {
    var hex_rep = val.toString(16);
    return (hex_rep.length === 1) ? '0' + hex_rep : hex_rep;
}

/**
 * selectBrush: Select the brush type to use
 * @param val:      Value of selection
 * @param ctx:      Canvas context
 * @param coord:    Location for the brush
 * @param stroke:   Stroke width
 * @param rad:      Brush radius (for circle brushes)
 * @return:         New brush instance
 */
function selectBrush(val, ctx, coord, stroke, rad) {
    var brush;
    
    switch (val) {
    case 'circle-brush':
        brush = new CircleBrush(ctx, coord, stroke, rad);
        break;
    case 'linear-brush':
        brush = new LinearBrush(ctx, coord, stroke);
        break;
    default:
        brush = new Brush(ctx, coord, stroke);
        break;
    }

    return brush
}

(function () {
    var MS_TIME = 500;
    var RADIUS = 25;
    var LINE = 2;

    var brush_select = document.getElementById('brush');
    var color_checkbox = document.getElementById('color');
    var smooth_checkbox = document.getElementById('smooth');
    var size_checkbox = document.getElementById('resize');
    var spin_checkbox = document.getElementById('spin');
    var pause_button = document.getElementById('pause');
    var ctx = document.getElementById('screen').getContext('2d');

    var change_color = color_checkbox.checked;
    var smooth_color = smooth_checkbox.checked;
    var change_size = size_checkbox.checked;
    var do_spin = spin_checkbox.checked;
    var playing = (pause_button.value === 'true');

    var start = 0;
    var coord = [ctx.canvas.clientWidth / 2, ctx.canvas.clientHeight / 2];
    var pulse_dir = [-1, -1, -1];
    var interval = Math.PI * 2 / MS_TIME;

    var color = new Pallete();
    var brush = selectBrush(brush_select.value, ctx, coord, LINE, RADIUS);

    color.generateRandom();
    brush.setColor(color.hex());

    brush_select.onchange = function () {
        brush = selectBrush(this.value, ctx, coord, LINE, RADIUS);
    }

    color_checkbox.onclick = function () {
        change_color = this.checked;
    }

    smooth_checkbox.onclick = function() {
        smooth_color = this.checked;
    }

    size_checkbox.onclick = function () {
        change_size = this.checked;
    }

    spin_checkbox.onclick = function () {
        do_spin = this.checked;
    }

    pause_button.onclick = function () {
        playing = !(this.value === 'true');
        pulse_dir = [-1, -1, -1];
        this.value = playing;
        this.style.backgroundColor = '#FFFFFF';
        this.innerHTML = (playing) ? "Pause" : "Play";
    }

    window.setInterval(function () {
        if (playing) {
            if (do_spin) {
                start = brush.spinDraw(start, interval);
                
                if (start > Math.PI * 2) {
                    color.generateRandom();
                    start = 0;
                }
            } else {
                brush.draw();
            }

            show(brush.coord, brush.radius, color);
            brush.move()
            
            if (change_size) {
                brush.randomResize(RADIUS);
            }
            
            if (change_color) {
                if (smooth_color) {
                    color.generateSmooth();
                } else {
                    color.generateRandom();
                }
            }

            brush.setColor(color.hex());
        } else {
            pulse_dir = pulse(pause_button, color.hex(), pulse_dir);
        }
    }, interval);

}());
