let nodeFs = require("fs"),
    mkdirp = require("mkdirp");

let Tool = {
    ensureFolderExist(path) {
        return new Promise((resolve, reject) => {
            let isExist = nodeFs.existsSync(path);

            if (!isExist) {
                mkdirp(path, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                })
            } else {
                resolve();
            }
        })
    }
};

module.exports = Tool;