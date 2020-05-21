const fs = require("fs");
let image = {};

(function loadFiles(dir = __dirname + "/cubes") {
	fs.readdirSync(dir).map(file => {
		file = file.split(".");
		return file[1] ? image[file[0]] = require(`${dir}/${file[0]}.js`) : loadFiles(`${dir}/${file[0]}`);
	});
}());

//megaminx, clk, squareone, skewb, pyraminx
module.exports.genImage = (cube, scramble, colorsIn) => {
	return image[cube].genImage(scramble, colorsIn);
}