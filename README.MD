A package that returns an image buffer when given a puzzle and scramble

Made from converting cstimer code to a package

Example Usage:

var fs = require("fs")

var scrambleImage = require("scramble-image")

var scrambleBuffer = await scrambleImage.genImage("megaminx", "R++ D-- U R--", "default")

//default specifies the color scheme, an example off a custom one would be "#fff#f0f" etc

fs.writeFileSync("megaminx.png", scrambleBuffer)

Valid inputs for puzzles
* clk
* megaminx
* pyraminx
* skewb
* squareone
* 222
* 333
* 444
* 555
* 666
* 777