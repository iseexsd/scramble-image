var fs = require("fs")
var scrambleImage = require("./main")

fs.writeFileSync("test.png", scrambleImage.genImage("squareone", "(0, 2) / (6, 0) / (1, -2) / (-3, 0) / (-1, -4) / (-3, 0) / (4, 0) / (-3, 0) / (5, -2) / (4, 0) / (-4, -1) / (-2, -2) / (0, -1)"))