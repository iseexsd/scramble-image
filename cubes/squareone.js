"use strict";
var Canvas = require("canvas")
var mathlib = require("../mathlib.js")

var squanCanvas, ctx;
var hsq3 = Math.sqrt(3) / 2;
var PI = Math.PI;

function Rotate(arr, theta) {
    return Transform(arr, [Math.cos(theta), -Math.sin(theta), 0, Math.sin(theta), Math.cos(theta), 0]);
}

function Transform(arr) {
    var ret;
    for (var i = 1; i < arguments.length; i++) {
        var trans = arguments[i];
        if (trans.length == 3) {
            trans = [trans[0], 0, trans[1] * trans[0], 0, trans[0], trans[2] * trans[0]];
        }
        ret = [[], []];
        for (var i = 0; i < arr[0].length; i++) {
            ret[0][i] = arr[0][i] * trans[0] + arr[1][i] * trans[1] + trans[2];
            ret[1][i] = arr[0][i] * trans[3] + arr[1][i] * trans[4] + trans[5];
        }
    }
    return ret;
}

function drawPolygon(ctx, color, arr, trans) {
    if (!ctx) {
        return;
    }
    trans = trans || [1, 0, 0, 0, 1, 0];
    arr = Transform(arr, trans);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(arr[0][0], arr[1][0]);
    for (var i = 1; i < arr[0].length; i++) {
        ctx.lineTo(arr[0][i], arr[1][i]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

var sq1Image = (function() {

    var Canvas = require("canvas")
    squanCanvas = new Canvas.createCanvas(495, 283.5);
    ctx = squanCanvas.getContext('2d');

    var posit = [];
    var mid = 0;

    //(move[0], move[1]) (/ = move[2])
    function doMove(move) {
        var newposit = [];

        //top move
        for (var i = 0; i < 12; i++) {
            newposit[(i + move[0]) % 12] = posit[i];
        }

        //bottom move
        for (var i = 0; i < 12; i++) {
            newposit[i + 12] = posit[(i + move[1]) % 12 + 12];
        }

        if (move[2]) {
            mid = 1 - mid;
            for (var i = 0; i < 6; i++) {
                mathlib.circle(newposit, i + 6, 23 - i);
            }
        }
        posit = newposit;
    }

    var ep = [
        [0, -0.5, 0.5],
        [0, -hsq3 - 1, -hsq3 - 1]
    ];
    var cp = [
        [0, -0.5, -hsq3 - 1, -hsq3 - 1],
        [0, -hsq3 - 1, -hsq3 - 1, -0.5]
    ];
    var cpr = [
        [0, -0.5, -hsq3 - 1],
        [0, -hsq3 - 1, -hsq3 - 1]
    ];
    var cpl = [
        [0, -hsq3 - 1, -hsq3 - 1],
        [0, -hsq3 - 1, -0.5]
    ];

    var eps = Transform(ep, [0.66, 0, 0]);
    var cps = Transform(cp, [0.66, 0, 0]);

    var udcol = 'UD';
    var ecol = '-B-R-F-L-B-R-F-L';
    var ccol = 'LBBRRFFLBLRBFRLF';
    var colors = {
        'U': '#ff0',
        'R': '#f80',
        'F': '#0f0',
        'D': '#fff',
        'L': '#f00',
        'B': '#00f'
    };

    var width = 45;

    var movere = /^\s*\(\s*(-?\d+),\s*(-?\d+)\s*\)\s*$/

    return function(moveseq, colorsIn) {
        let cols = ""
        if(colorsIn === "default") {
            cols = "#ff0#f80#0f0#fff#f00#00f".match(colre);
        } else {
            cols = colorsIn.match(colre);
        }
        colors = {
            'U': cols[0],
            'R': cols[1],
            'F': cols[2],
            'D': cols[3],
            'L': cols[4],
            'B': cols[5]
        };
        posit = [0, 0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 12, 12, 13, 14, 14, 15];
        mid = 0;
        var moves = moveseq.split('/');
        for (var i = 0; i < moves.length; i++) {
            if (/^\s*$/.exec(moves[i])) {
                doMove([0, 0, 1]);
                continue;
            }
            var m = movere.exec(moves[i]);
            doMove([~~m[1] + 12, ~~m[2] + 12, 1]);
        }
        doMove([0, 0, 1]);

        var trans = [width, 2.7, 2.7];
        //draw top
        for (var i = 0; i < 12; i++) {
            if (posit[i] % 2 == 0) { //corner piece
                if (posit[i] != posit[(i + 1) % 12]) {
                    continue;
                }
                drawPolygon(ctx, colors[ccol[posit[i]]],
                    Rotate(cpl, (i - 3) * PI / 6), trans);
                drawPolygon(ctx, colors[ccol[posit[i] + 1]],
                    Rotate(cpr, (i - 3) * PI / 6), trans);
                drawPolygon(ctx, colors[udcol[posit[i] >= 8 ? 1 : 0]],
                    Rotate(cps, (i - 3) * PI / 6), trans);
            } else { //edge piece
                drawPolygon(ctx, colors[ecol[posit[i]]],
                    Rotate(ep, (i - 5) * PI / 6), trans);
                drawPolygon(ctx, colors[udcol[posit[i] >= 8 ? 1 : 0]],
                    Rotate(eps, (i - 5) * PI / 6), trans);
            }
        }

        var trans = [width, 2.7 + 5.4, 2.7];
        //draw bottom
        for (var i = 12; i < 24; i++) {
            if (posit[i] % 2 == 0) { //corner piece
                if (posit[i] != posit[(i + 1) % 12 + 12]) {
                    continue;
                }
                drawPolygon(ctx, colors[ccol[posit[i]]],
                    Rotate(cpl, -i * PI / 6), trans);
                drawPolygon(ctx, colors[ccol[posit[i] + 1]],
                    Rotate(cpr, -i * PI / 6), trans);
                drawPolygon(ctx, colors[udcol[posit[i] >= 8 ? 1 : 0]],
                    Rotate(cps, -i * PI / 6), trans);
            } else { //edge piece
                drawPolygon(ctx, colors[ecol[posit[i]]],
                    Rotate(ep, (-1 - i) * PI / 6), trans);
                drawPolygon(ctx, colors[udcol[posit[i] >= 8 ? 1 : 0]],
                    Rotate(eps, (-1 - i) * PI / 6), trans);
            }
        }

        var trans = [width, 2.7 + 2.7, 2.7 + 3.0];
        //draw middle
        drawPolygon(ctx, colors['L'], [[-hsq3 - 1, -hsq3 - 1, -0.5, -0.5], [0.5, -0.5, -0.5, 0.5]], trans);
        if (mid == 0) {
            drawPolygon(ctx, colors['L'], [[hsq3 + 1, hsq3 + 1, -0.5, -0.5], [0.5, -0.5, -0.5, 0.5]], trans);
        } else {
            drawPolygon(ctx, colors['R'], [[hsq3, hsq3, -0.5, -0.5], [0.5, -0.5, -0.5, 0.5]], trans);
        }

        return squanCanvas.toBuffer()
    }
})();

module.exports.genImage = (scramble, colorsIn) => {
    return sq1Image(scramble, colorsIn);
}

var colre = /#[0-9a-fA-F]{3}/g;