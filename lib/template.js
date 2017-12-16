let nodeOs = require("os"),
    nodePath = require("path"),
    nodeFs = require("fs"),
    decompress = require("decompress");

let CONFIG = require("./config"),
    HttpServer = require("./http-server"),
    Tool = require("./tools");

let Template = {
    async run(data) {
        let templatePath = this._buildTemplateSavePath(data);

        if (!nodeFs.existsSync(templatePath)) {
            await Tool.ensureFolderExist(this._buildTemplateSaveFolder(data));
            await HttpServer.downloadFile(data.downloadUrl.href, templatePath);
        }
        await this.extractTemplate(data);
    },

    extractTemplate(data) {
        let filePath = this._buildTemplateSavePath(data);

        return decompress(filePath, process.cwd());
    },

    _buildTemplateSavePath(data) {
        return nodePath.join(this._buildTemplateSaveFolder(data), data.name);
    },

    _buildTemplateSaveFolder(data) {
        return nodePath.join(nodeOs.homedir(), CONFIG.CACHE_FOLER, data.templateName, data.version);        
    }
};

module.exports = Template;