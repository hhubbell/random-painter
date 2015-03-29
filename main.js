
function spin_draw(ctx, r, c, start, distance) {
    var x = c[0];
    var y = c[1];
    var end = start + distance;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + r, y);
    ctx.arc(x, y, r, 0, end);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    return end;
}

function solid_draw(ctx, r, c) {
    var x = c[0];
    var y = c[1];

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function move(ctx, r, old, neg_allow) {
    var newc = [];

    newc[0] = old[0] + ((Math.floor(Math.random() * 2) === 1) ? 1 : -1);
    newc[1] = old[1] + ((Math.floor(Math.random() * 2) === 1) ? 1 : -1);

    if (neg_allow) {
        if (newc[0] + r >= ctx.canvas.clientWidth || newc[0] - r <= 0) {
            newc[0] = old[0];
        }

        if (newc[1] + r >= ctx.canvas.clientHeight || newc[1] - r <= 0) {
            newc[1] = old[1];
        }
    }
    return newc;
}

function size(max) {
    return Math.floor(Math.random() * max)
}

function pulse(el, to, dir) {
    var SMOOTHING = 1;
    var RGB_RE = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(1|0\.\d+))?\)$/;

    var to = to.split('#')[1];
    var from = el.style.backgroundColor.match(RGB_RE);
    var all_done = false;
    var tr = parseInt(to.slice(0,2), 16);
    var tg = parseInt(to.slice(2,4), 16);
    var tb = parseInt(to.slice(4,6), 16);
    var fr;
    var fg;
    var fb;
    var rh;
    var bh;
    var gh;

    if (from) {
        from = from.slice(1,4);
    } else {
        from = [255, 255, 255];
    }

    fr = parseInt(from[0]);
    fg = parseInt(from[1]);
    fb = parseInt(from[2]);

    all_done = (fr <= tr || fr >= 255) &&
                (fg <= tg || fg >= 255) &&
                (fb <= fb || fb >= 255);

    if (fr > tr && dir[0] === -1 || fr < 255 && dir[0] === 1) {
        fr += SMOOTHING * dir[0];
    } else if (all_done) {
        dir[0] *= -1;
    }

    if (fg > tg && dir[1] === -1 || fg < 255 && dir[1] === 1) {
        fg += SMOOTHING * dir[1];
    } else if (all_done) {
        dir[1] *= -1;
    }

    if (fb > tb && dir[2] === -1 || fb < 255 && dir[2] === 1) {
        fb += SMOOTHING * dir[2];
    } else if (all_done) {
        dir[2] *= -1;
    }

    rh = fr.toString(16);
    gh = fg.toString(16);
    bh = fb.toString(16);

    rh = (rh.length === 1) ? '0' + rh : rh;
    gh = (gh.length === 1) ? '0' + gh : gh;
    bh = (bh.length === 1) ? '0' + bh : bh;

    el.style.backgroundColor = '#' + rh + gh + bh;

    return dir;
}

function show(c, r, l) {
    document.getElementById('xcoord').innerHTML = c[0];
    document.getElementById('ycoord').innerHTML = c[1];
    document.getElementById('radius').innerHTML = r;
    document.getElementById('current-color').innerHTML = l;
}

function hex(val) {
    var hex_rep = val.toString(16);
    return (hex_rep.length === 1) ? '0' + hex_rep : hex_rep;
}

function random_hex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function smooth_hex(start) {
    var SMOOTHING = 5;

    var hex_split = start.split('#')[1];
    var r = parseInt(hex_split.slice(0,2), 16);
    var g = parseInt(hex_split.slice(2,4), 16);
    var b = parseInt(hex_split.slice(4,6), 16);
    var dir = (Math.floor(Math.random() * 2) === 1) ? 1 : -1;
    var dlt = dir * Math.floor(Math.random() * SMOOTHING);
    var rbg_string;    

    switch (Math.floor(Math.random() * 3)) {
        case 0:
            if (r + dlt <= 255 && r + dlt >= 0) {
                r += dlt;
            }
            break;
        case 1:
            if (g + dlt <= 255 && g + dlt >= 0) {
                g += dlt;
            }
            break;
        case 2:
            if (b + dlt <= 255 && b + dlt >= 0) {
                b += dlt;
            }
            break;
    }

    rgb_string = '(' + r + ', ' + g + ', ' + b + ')';
    document.getElementById('rgb-color').innerHTML = rgb_string;

    return '#' + hex(r) + hex(g) + hex(b);
}

(function () {
    var MS_TIME = 500;
    var RADIUS = 25;
    var LINE = 2;

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
    var color = random_hex();
    var rad = RADIUS;
    var pulse_dir = [-1, -1, -1];
    var interval = Math.PI * 2 / MS_TIME;
    var coord = [ctx.canvas.clientWidth / 2, ctx.canvas.clientHeight / 2];

    ctx.lineWidth = LINE;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

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
                start = spin_draw(ctx, rad, coord, start, interval);

                if (start > Math.PI * 2) {
                    color = random_hex();
                    start = 0;
                }
            } else {
                solid_draw(ctx, rad, coord);
            }

            show(coord, rad, color);
            coord = move(ctx, RADIUS, coord, true);

            if (change_size) {
                rad = size(RADIUS);
            }
            
            if (change_color) {
                if (smooth_color) {
                    color = smooth_hex(color);
                } else {
                    color = random_hex();
                }
            }

            ctx.strokeStyle = color;
            ctx.fillStyle = color;
        } else {
            pulse_dir = pulse(pause_button, color, pulse_dir);
        }
    }, interval);

}());
