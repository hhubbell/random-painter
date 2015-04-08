/*
 * Filename:        pallete.js
 * Author:          Harrison Hubbell
 * Date:            04/08/2015
 * Description:     Pallete Object for determining colors.
 */

/**
 * Pallete: Pallete Object for determining color
 * @optional red:   Start color red
 * @optional green: Start color green
 * @optional blue:  Start color blue
 */
function Pallete(red, green, blue) {
    this.red = red || 255;
    this.green = green || 255;
    this.blue = blue || 255;
}

/**
 * Pallete.SMOOTHING: Maximum bound for generating smooth random color.
 */
Pallete.prototype.SMOOTHING = 5;

/**
 * Pallete.toHex:   Convert an integer between 0 and 255 to
 *                  its hexidecimal val
 * @param val:      Color integer
 * @throws:         RangeError if integer is out of bounds
 * @return:         Hexidecimal value
 */
Pallete.prototype.toHex = function (val) {
    var hex;
    
    if (val >= 0 && val <= 255) {
        hex = val.toString(16)
    } else {
        throw new RangeError('Value ' + val + ' out of range [0, 255]');
    }

    return (hex.length === 1) ? '0' + hex : hex;
}

/**
 * Pallete.hex: Return the current pallete color in hexidecimal format
 * @return:         Hexidecimal color representation
 */
Pallete.prototype.hex = function () {
    return '#' + this.toHex(this.red) +
                this.toHex(this.green) + 
                this.toHex(this.blue);
}

/**
 * Pallete.rgb: Return the currente pallete color in rgb format
 * @return:         RGB color dictionary
 */
Pallete.prototype.rgb = function () {
    return {r: this.red, g: this.green, b: this.blue};
}

/**
 * Pallete.generateSmooth:  Return a new color in specified format
 *                          based on smoothing
 * @optional as:    Return as
 * @return:         New smoothed color
 */
Pallete.prototype.generateSmooth = function (as) {
    var dir = (Math.floor(Math.random() * 2) === 1) ? 1 : -1;
    var delta = dir * Math.floor(Math.random() * this.SMOOTHING);
    var val;

    switch (Math.floor(Math.random() * 3)) {
    case 0:
        if (this.red + delta <= 255 && this.red + delta >= 0) {
            this.red += delta;
        }
        break;
    case 1:
        if (this.green + delta <= 255 && this.green + delta >= 0) {
            this.green += delta;
        }
        break;
    case 2:
        if (this.blue + delta <= 255 && this.blue + delta >= 0) {
            this.blue += delta;
        }
        break;
    }

    if (as === 'rgb') {
        val = this.rgb();
    } else if (as === 'hex') {
        val = this.hex();
    }

    return val;
}

/**
 * Pallete.generateRandom:  Return a new color in the specified format
 *                          based on random value
 * @optional as:    Return as
 * @return:         New random color
 */
Pallete.prototype.generateRandom = function (as) {
    var val;    
    
    this.red = Math.floor(Math.random() * 256);
    this.green = Math.floor(Math.random() * 256);
    this.blue = Math.floor(Math.random() * 256);
 
    if (as === 'rgb') {
        val = this.rgb();
    } else if (as === 'hex') {
        val = this.hex();
    }

    return val;
}
