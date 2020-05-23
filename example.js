var fs = require("fs")
var scrambleImage = require("./main")

var stdin = process.openStdin()

stdin.addListener("data", (d) => {
    d = d.toString().trim().split(" ")
    let cubeType = d[0]
    d.shift()
    let scramble = d.join(" ")

    fs.writeFileSync("test.png", scrambleImage.genImage(cubeType, scramble, "default"))
})
