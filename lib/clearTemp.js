const fs = require("fs");
var path = require("path");
module.exports = function (dir) {
	console.log("cleartemp called");
    fs.readdir(dir, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(dir, file), err => {
                if (err) throw err;
            });
        }
    });
}