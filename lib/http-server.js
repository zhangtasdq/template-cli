let nodeFs = require("fs"),
    nodeHttp = require("http");

let HttpServer = {
    downloadFile(url, dest) {
        return new Promise((resolve, reject) => {
            let file = nodeFs.createWriteStream(dest);

            nodeHttp.get(url, (response) => {
                response.pipe(file);
    
                file.on("finish", () => {
                    file.close(resolve);
                });
            }).on("error", (error) => {
                nodeFs.unlink(dest);
                reject(error);
            });
        });
    }
};

module.exports = HttpServer;