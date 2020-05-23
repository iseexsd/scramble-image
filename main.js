let nnn = require("./cubes/nnn")
let clock = require("./cubes/clk")
let megaminx = require("./cubes/megaminx")
let pyraminx = require("./cubes/pyraminx")
let skewb = require("./cubes/skewb")
let squareone = require("./cubes/squareone")


//megaminx, clk, squareone, skewb, pyraminx, 222, 333, 444, 555, 666, 777
//just set colorsIn to "default"
module.exports.genImage = (cube, scramble, colorsIn) => {
	if(cube === "222") return nnn.genImage(2, scramble, colorsIn)
	else if(cube === "333") return nnn.genImage(3, scramble, colorsIn)
	else if(cube === "444") return nnn.genImage(4, scramble, colorsIn)
	else if(cube === "555") return nnn.genImage(5, scramble, colorsIn)
	else if(cube === "666") return nnn.genImage(6, scramble, colorsIn)
	else if(cube === "777") return nnn.genImage(7, scramble, colorsIn)
	else if(cube === "clk") return clock.genImage(scramble, colorsIn)
	else if(cube === "megaminx") return megaminx.genImage(scramble, colorsIn)
	else if(cube === "pyraminx") return pyraminx.genImage(scramble, colorsIn)
	else if(cube === "skewb") return skewb.genImage(scramble, colorsIn)
	else if(cube === "squareone") return squareone.genImage(scramble, colorsIn)
}