var fs = require("fs")
var scrambleImage = require("./main")

fs.writeFileSync("test.png", scrambleImage.genImage("7", "3Rw F2"))