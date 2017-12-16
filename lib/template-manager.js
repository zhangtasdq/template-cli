let fs = require("fs"),
    path = require("path"),
    http = require("http"),
    config = require("./config"),
    tools = require("./tools"),
    mkdirp = require("mkdirp"),
    decompress = require("decompress");

let templateManager = {
    isTemplateExists(info) {
        let templatePath = this._buildTemplateFilePath(info);

        return tools.isExists(templatePath);
    },
    
    async downloadTemplate(info) {
        await this._createTemplateFolder(info);

        return new Promise((resolve, reject) => {
            let templateFilePath = this._buildTemplateFilePath(info),
                file = fs.createWriteStream(templateFilePath);

            http.get(info.downloadUrl, (response) => {
                response.pipe(file);

                file.on("finish", () => {
                    file.close((error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    });
                });
            }).on("error", reject);
        });
    },

    async _createTemplateFolder(info) {
        return new Promise(async (resolve, reject) => {
            let templateFolder = this._buildTemplatePath(info),
                isFolderExist = await tools.isExists(templateFolder);
            
            if (isFolderExist) {
                resolve();
            } else {
                mkdirp(templateFolder, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            }
        });
    },

    extractTemplateTo(info, destPath) {
        let filePath = this._buildTemplateFilePath(info);

        return decompress(filePath, destPath);
    },

    _buildTemplatePath(info) {
        let cacheFolder = config.getCachePath();

        return path.join(cacheFolder, info.templateName, info.version);
    },

    _buildTemplateFilePath(info) {
        let cacheFolder = config.getCachePath();

        return path.join(cacheFolder, info.templateName, info.version, info.name);
    }
};

module.exports = templateManager;