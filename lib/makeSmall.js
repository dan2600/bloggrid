var Jimp = require("jimp");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
module.exports = function (URL, directory, index) {
    var uniqueFilename = require("unique-filename");
    var filename = uniqueFilename("./public/images") + ".jpg";

    Jimp.read(URL[index]["media:content"]["url"], function(err, makem) {
        if (err) throw err;
        makem.quality(90).write(filename, function() {
            URL[index]["media:content"]["url"] = filename.split("public/")[1];
            URL[index].optimized = true;
            imagemin([filename], "./public/images", {
                plugins: [imageminJpegtran()]
            }).then(files => {});
        });
    });
}
