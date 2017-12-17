let { URL } = require("url"),
    nodeOs = require("os"),
    nodePath = require("path"),
    nodeFs = require("fs"),
    shelljs = require("shelljs");

let ConfigManager = require("./config-manager"),
    VersionManager = require("./version-manager"),
    CONFIG = require("./config"),
    Tool = require("./tools"),
    HttpServer = require("./http-server"),
    Parser = require("./parser"),
    MsgService = require("./msg-service");

let TemplateManager = {
    async download(options) {
        if (!ConfigManager.haveServerUrl()) {
            MsgService.showError("template-cli: server is need!");
            return;
        }
        let templateData = await VersionManager.getTemplateData(options.templateName, options.version);

        if (!templateData) {
            MsgService.showError(`template-cli: ${options.templateName}@${options.version} not found`);
            return;
        }
        let templatePath = this._buildTemplateSavePath(templateData),
            templateFolder = this._buildTemplateSaveFolder(templateData);
        
        templateData.localPath = templatePath;
        templateData.localFolder = templateFolder;

        if (!nodeFs.existsSync(templateData.localPath)) {
            let downLoadUrl = this._buildTempateDownLoadUrl(templateData.path);

            await Tool.ensureFolderExist(templateData.localFolder);
            await HttpServer.downloadFile(downLoadUrl.href, templateData.localPath);
        }
        
        let parseFolder = await Parser.parse(templateData);

        this._copyTemplateToDest(parseFolder);
        this._cleanTemplateFolder(parseFolder);
    },

    _copyTemplateToDest(parseFolder) {
        let parseContentFolder = this._buildParseContentFolder(parseFolder);

        shelljs.cp("-R", parseContentFolder + "/*", process.cwd());
    },

    _cleanTemplateFolder(parseFolder) {
        shelljs.rm("-r", parseFolder);        
    },

    _buildTempateDownLoadUrl(path) {
        let server = ConfigManager.getServerUrl();

        return new URL(path, server);
    },

    _buildTemplateSavePath(data) {
        return nodePath.join(this._buildTemplateSaveFolder(data), data.name);
    },

    _buildTemplateSaveFolder(data) {
        return nodePath.join(nodeOs.homedir(), CONFIG.CACHE_FOLER, data.templateName, data.version);        
    },

    _buildParseContentFolder(path) {
        return nodePath.join(path, "base");
    }
};

module.exports = TemplateManager;