let fs = require("fs");

let tools = {
    isExists(filePath) {
        return new Promise((resolve) => {
            fs.access(filePath, (error) => {
                if (error && error.code === "ENOENT") {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }
};

module.exports = tools;