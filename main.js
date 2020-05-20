const fs = require("fs");
let image = {};

(function loadFiles(dir = __dirname + "/cubes") {
	fs.readdirSync(dir).map(file => {
		file = file.split(".");
		return file[1] ? image[file[0]] = require(`${dir}/${file[0]}.js`) : loadFiles(`${dir}/${file[0]}`);
	});
}());

//megaminx, clk, 2, 3, 4, 5, 6, 7
module.exports.genImage = (cube, scramble) => {
	if(!isNaN(cube)) {
		if(cube === "2") {
			return image["nnn"].genImage(cube, scramble);
		} else if(cube === "3") {
			return image["nnn"].genImage(cube, scramble);
		} else if(cube === "4") {
			return image["nnn"].genImage(cube, scramble);
		} else if(cube === "5") {
			return image["nnn"].genImage(cube, scramble);
		} else if(cube === "6") {
			return image["nnn"].genImage(cube, scramble);
		} else if(cube === "7") {
			return image["nnn"].genImage(cube, scramble);
		}
	} else {
		return image[cube].genImage(scramble);
	}
}