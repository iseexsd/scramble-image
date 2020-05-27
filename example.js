var fs = require("fs")
var scrambleImage = require("./main")

fs.writeFileSync("test.png", scrambleImage.genImage("222", "z' y2 x R2 F'", "default"))