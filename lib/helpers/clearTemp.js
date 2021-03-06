//Function to clear Temp Image Directory on RSS updates
'use strict';
const fs = require('fs');
var path = require('path');
module.exports = function (dir) {
	fs.readdir(dir, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(dir, file), err => {
                if (err) throw err;
            });
        }
    });
}