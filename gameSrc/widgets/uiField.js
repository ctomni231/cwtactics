"use strict";

var i18n = require("./system/localization");

/**
 *
 * @param x
 * @param y
 * @param w
 * @param h
 * @param text
 * @param fsize
 * @param style
 * @param actionFn
 * @constructor
 * @class
 */
exports.UIField = function (x, y, w, h, text, fsize, style, actionFn) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.fsize = fsize;
    this.style = style;
    this.inFocus = false;
    this.action = actionFn;
    this.inactive = false;

    this.key = text;
    this.text = text ? i18n.forKey(text) : text;
    if (this.text.search(/\n/) !== -1) {
        this.text = this.text.split("\n");
    }
};

exports.UIField.STYLE_NONE = -1;
exports.UIField.STYLE_NORMAL = 0;
exports.UIField.STYLE_S = 1;
exports.UIField.STYLE_N = 2;
exports.UIField.STYLE_W = 3;
exports.UIField.STYLE_E = 4;
exports.UIField.STYLE_NE = 5;
exports.UIField.STYLE_NW = 6;
exports.UIField.STYLE_ES = 7;
exports.UIField.STYLE_SW = 8;
exports.UIField.STYLE_EW = 13;
exports.UIField.STYLE_NS = 14;
exports.UIField.STYLE_ESW = 9;
exports.UIField.STYLE_NEW = 10;
exports.UIField.STYLE_NSW = 11;
exports.UIField.STYLE_NES = 12;

/**
 *
 * @param x
 * @param y
 * @returns {boolean}
 */
exports.UIField.positionInButton = function (x, y) {
    return (x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height);
};

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 */
exports.UIField.erase = function (ctx) {
    ctx.clearRect(this.x, this.y, this.width, this.height);
};

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 */
exports.UIField.draw = function (ctx) {
    if (this.style === exports.UIField.STYLE_NONE) {
        return;
    }

    ctx.fillStyle = (this.inFocus) ? "rgb(220,220,220)" : "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // draw borders
    ctx.fillStyle = "rgb(60,60,60)";
    switch (this.style) {

        case exports.UIField.STYLE_NORMAL:
            ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);
            ctx.fillStyle = (this.inFocus) ? "rgb(220,220,220)" : "white";
            ctx.fillRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6);
            break;

        case exports.UIField.STYLE_N:
            ctx.fillRect(this.x, this.y + 1, this.width, 2);
            break;

        case exports.UIField.STYLE_E:
            ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height);
            break;

        case exports.UIField.STYLE_S:
            ctx.fillRect(this.x, this.y + this.height - 3, this.width, 2);
            break;

        case exports.UIField.STYLE_W:
            ctx.fillRect(this.x + 1, this.y, 2, this.height);
            break;

        case exports.UIField.STYLE_NE:
            ctx.fillRect(this.x, this.y + 1, this.width - 1, 2);
            ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, this.height - 1);
            break;

        case exports.UIField.STYLE_NW:
            ctx.fillRect(this.x + 1, this.y + 1, this.width, 2);
            ctx.fillRect(this.x + 1, this.y + 1, 2, this.height - 1);
            break;

        case exports.UIField.STYLE_ES:
            ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height - 1);
            ctx.fillRect(this.x, this.y + this.height - 3, this.width - 1, 2);
            break;

        case exports.UIField.STYLE_SW:
            ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 1, 2);
            ctx.fillRect(this.x + 1, this.y, 2, this.height - 1);
            break;

        case exports.UIField.STYLE_EW:
            ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height);
            ctx.fillRect(this.x + 1, this.y, 2, this.height);
            break;

        case exports.UIField.STYLE_NS:
            ctx.fillRect(this.x, this.y + 1, this.width, 2);
            ctx.fillRect(this.x, this.y + this.height - 3, this.width, 2);
            break;

        case exports.UIField.STYLE_ESW:
            ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height - 1);
            ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 2, 2);
            ctx.fillRect(this.x + 1, this.y, 2, this.height - 1);
            break;

        case exports.UIField.STYLE_NEW:
            ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, 2);
            ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, this.height - 1);
            ctx.fillRect(this.x + 1, this.y + 1, 2, this.height - 1);
            break;

        case exports.UIField.STYLE_NSW:
            ctx.fillRect(this.x + 1, this.y + 1, this.width - 1, 2);
            ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 1, 2);
            ctx.fillRect(this.x + 1, this.y + 1, 2, this.height - 2);
            break;

        case exports.UIField.STYLE_NES:
            ctx.fillRect(this.x, this.y + 1, this.width - 1, 2);
            ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, this.height - 2);
            ctx.fillRect(this.x, this.y + this.height - 3, this.width - 1, 2);
            break;
    }

    ctx.fillStyle = "black";
    ctx.font = this.fsize + "pt " + constants.GAME_FONT;

    var tw;
    if (this.text) {
        if (typeof this.text === "string") {
            tw = ctx.measureText(this.text);
            ctx.fillText(
                this.text,
                    this.x + (this.width / 2) - (tw.width / 2),
                    this.y + (this.height / 2) + this.fsize / 2);
        } else {
            for (var i = 0, e = this.text.length; i < e; i++) {
                tw = ctx.measureText(this.text[i]);
                ctx.fillText(
                    this.text[i],
                        this.x + (this.width / 2) - (tw.width / 2),
                        this.y + this.fsize + ((i + 1) * (this.fsize + 8)));
            }
        }
    }
};