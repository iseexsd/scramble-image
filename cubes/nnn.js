var fs = require("fs")

var canvas, ctx;

var scrambleReg = /^([\d]+)?([FRUBLDfrubldzxySME])(?:([w])|&sup([\d]);)?([2'])?$/;

function parseScramble(scramble, moveMap) {
    var moveseq = [];
    var moves = scramble.split(" ")
    moves.unshift(" ")
    console.log(moves)
    var m, w, f, p;
    for (var s=0; s<moves.length; s++) {
        m = scrambleReg.exec(moves[s]);
        if (m == null) {
            continue;
        }
        f = "FRUBLDfrubldzxySME".indexOf(m[2]);
        if (f > 14) {
            p = "2'".indexOf(m[5] || 'X') + 2;
            f = [0, 4, 5][f % 3];
            moveseq.push([moveMap.indexOf("FRUBLD".charAt(f)), 2, p]);
            moveseq.push([moveMap.indexOf("FRUBLD".charAt(f)), 1, 4-p]);
            continue;
        }
        w = f < 12 ? (~~m[1] || ~~m[4] || ((m[3] == "w" || f > 5) && 2) || 1) : -1;
        p = (f < 12 ? 1 : -1) * ("2'".indexOf(m[5] || 'X') + 2);
        moveseq.push([moveMap.indexOf("FRUBLD".charAt(f % 6)), w, p]);
    }
    return moveseq;
}

function Transform(arr) {
    var ret;
    for (var i = 1; i < arguments.length; i++) {
        var trans = arguments[i];
        if (trans.length === 3) {
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

var nnnImage = (function() {
    var width = 30;

    var posit = [];
    var colors = ['#ff0', '#fa0', '#00f', '#fff', '#f00', '#0d0'];

    function face(f, size) {
        var offx = 10 / 9,
            offy = 10 / 9;
        if (f == 0) { //D
            offx *= size;
            offy *= size * 2;
        } else if (f == 1) { //L
            offx *= 0;
            offy *= size;
        } else if (f == 2) { //B
            offx *= size * 3;
            offy *= size;
        } else if (f == 3) { //U
            offx *= size;
            offy *= 0;
        } else if (f == 4) { //R
            offx *= size * 2;
            offy *= size;
        } else if (f == 5) { //F
            offx *= size;
            offy *= size;
        }

        for (var i = 0; i < size; i++) {
            var x = (f == 1 || f == 2) ? size - 1 - i : i;
            for (var j = 0; j < size; j++) {
                var y = (f == 0) ? size - 1 - j : j;
                drawPolygon(ctx, colors[posit[(f * size + y) * size + x]], [
                    [i, i, i + 1, i + 1],
                    [j, j + 1, j + 1, j]
                ], [width, offx, offy]);
            }
        }
    }

    /**
     *  f: face, [ D L B U R F ]
     *  d: which slice, in [0, size-1)
     *  q: [  2 ']
     */
    function doslice(f, d, q, size) {
        var f1, f2, f3, f4;
        var s2 = size * size;
        var c, i, j, k;
        if (f > 5) f -= 6;
        for (k = 0; k < q; k++) {
            for (i = 0; i < size; i++) {
                if (f == 0) {
                    f1 = 6 * s2 - size * d - size + i;
                    f2 = 2 * s2 - size * d - 1 - i;
                    f3 = 3 * s2 - size * d - 1 - i;
                    f4 = 5 * s2 - size * d - size + i;
                } else if (f == 1) {
                    f1 = 3 * s2 + d + size * i;
                    f2 = 3 * s2 + d - size * (i + 1);
                    f3 = s2 + d - size * (i + 1);
                    f4 = 5 * s2 + d + size * i;
                } else if (f == 2) {
                    f1 = 3 * s2 + d * size + i;
                    f2 = 4 * s2 + size - 1 - d + size * i;
                    f3 = d * size + size - 1 - i;
                    f4 = 2 * s2 - 1 - d - size * i;
                } else if (f == 3) {
                    f1 = 4 * s2 + d * size + size - 1 - i;
                    f2 = 2 * s2 + d * size + i;
                    f3 = s2 + d * size + i;
                    f4 = 5 * s2 + d * size + size - 1 - i;
                } else if (f == 4) {
                    f1 = 6 * s2 - 1 - d - size * i;
                    f2 = size - 1 - d + size * i;
                    f3 = 2 * s2 + size - 1 - d + size * i;
                    f4 = 4 * s2 - 1 - d - size * i;
                } else if (f == 5) {
                    f1 = 4 * s2 - size - d * size + i;
                    f2 = 2 * s2 - size + d - size * i;
                    f3 = s2 - 1 - d * size - i;
                    f4 = 4 * s2 + d + size * i;
                }
                c = posit[f1];
                posit[f1] = posit[f2];
                posit[f2] = posit[f3];
                posit[f3] = posit[f4];
                posit[f4] = c;
            }
            if (d == 0) {
                for (i = 0; i + i < size; i++) {
                    for (j = 0; j + j < size - 1; j++) {
                        f1 = f * s2 + i + j * size;
                        f3 = f * s2 + (size - 1 - i) + (size - 1 - j) * size;
                        if (f < 3) {
                            f2 = f * s2 + (size - 1 - j) + i * size;
                            f4 = f * s2 + j + (size - 1 - i) * size;
                        } else {
                            f4 = f * s2 + (size - 1 - j) + i * size;
                            f2 = f * s2 + j + (size - 1 - i) * size;
                        }
                        c = posit[f1];
                        posit[f1] = posit[f2];
                        posit[f2] = posit[f3];
                        posit[f3] = posit[f4];
                        posit[f4] = c;
                    }
                }
            }
        }
    }

    return function(size, moveseq) {

        var Canvas = require('canvas');

        canvas = new Canvas.createCanvas(39 * size / 9 * width + 1, 29 * size / 9 * width + 1);
        ctx = canvas.getContext('2d');

        colors = "#ff0#fa0#00f#fff#f00#0d0".match(colre);
        var cnt = 0;
        for (var i = 0; i < 6; i++) {
            for (var f = 0; f < size * size; f++) {
                posit[cnt++] = i;
            }
        }
        var moves = parseScramble(moveseq, "DLBURF");
        for (var s = 0; s < moves.length; s++) {
            for (var d = 0; d < moves[s][1]; d++) {
                doslice(moves[s][0], d, moves[s][2], size)
            }
            if (moves[s][1] == -1) {
                for (var d = 0; d < size - 1; d++) {
                    doslice(moves[s][0], d, -moves[s][2], size);
                }
                doslice((moves[s][0] + 3) % 6, 0, moves[s][2] + 4, size);
            }
        }

        for (var i = 0; i < 6; i++) {
            face(i, size);
        }
        return canvas.toBuffer()
    }
})();

module.exports.genImage = (cube, scramble) => {
    return nnnImage(cube, scramble);
}

var colre = /#[0-9a-fA-F]{3}/g;